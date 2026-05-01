const db = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/* ======================================================
   CREATE ADMIN TABLE
====================================================== */

const createCareersAdminsTable = async () => {
  try {

    const query = `
      CREATE TABLE IF NOT EXISTS careers_tbl_admins (

          id INT PRIMARY KEY AUTO_INCREMENT,

          uuid CHAR(36) NOT NULL UNIQUE,

          full_name VARCHAR(150) NOT NULL,

          email VARCHAR(150) NOT NULL UNIQUE,

          password VARCHAR(255) NOT NULL,

          role ENUM(
              'Root Admin',
              'Admin',
              'HR'
          ) DEFAULT 'HR',

          status ENUM(
              'Active',
              'Inactive'
          ) DEFAULT 'Active',

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          created_by INT NULL,

          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,

          updated_by INT NULL

      )
    `;

    await db.query(query);

    await createDefaultRootUser();

  } catch (error) {
    console.error("Error creating careers_tbl_admins:", error.message);
  }
};

/* ======================================================
   CREATE DEPARTMENTS TABLE
====================================================== */

const createCareersDepartmentsTable = async () => {
  try {

    const query = `
      CREATE TABLE IF NOT EXISTS careers_tbl_departments (

          id INT PRIMARY KEY AUTO_INCREMENT,

          uuid CHAR(36) NOT NULL UNIQUE,

          department_name VARCHAR(150) NOT NULL UNIQUE,

          department_slug VARCHAR(150) NOT NULL UNIQUE,

          status ENUM(
              'Active',
              'Inactive'
          ) DEFAULT 'Active',

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          created_by INT NULL,

          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,

          updated_by INT NULL

      )
    `;

    await db.query(query);

    await createDefaultDepartments();

  } catch (error) {
    console.error(
      "Error creating careers_tbl_departments:",
      error.message
    );
  }
};

/* ======================================================
   INSERT DEFAULT DEPARTMENTS
====================================================== */

const createDefaultDepartments = async () => {
  try {

    const departments = [
      "Development",
      "Design",
      "Digital Marketing",
      "Media"
    ];

    for (const dept of departments) {

      const slug = dept
        .toLowerCase()
        .replace(/\s+/g, "-");

      const [existing] = await db.query(
        "SELECT id FROM careers_tbl_departments WHERE department_name = ?",
        [dept]
      );

      if (existing.length === 0) {

        await db.query(
          `
          INSERT INTO careers_tbl_departments (
            uuid,
            department_name,
            department_slug,
            status,
            created_by
          )
          VALUES (?, ?, ?, 'Active', 1)
          `,
          [
            uuidv4(),
            dept,
            slug
          ]
        );

      }
    }

  } catch (error) {
    console.error(
      "Error inserting default departments:",
      error.message
    );
  }
};

/* ======================================================
   CREATE CATEGORIES TABLE
====================================================== */

const createCareersCategoriesTable = async () => {
  try {

    const query = `
      CREATE TABLE IF NOT EXISTS careers_tbl_categories (

          id INT PRIMARY KEY AUTO_INCREMENT,

          uuid CHAR(36) NOT NULL UNIQUE,

          department_id INT NOT NULL,

          category_name VARCHAR(150) NOT NULL,

          category_slug VARCHAR(150) NOT NULL,

          status ENUM(
              'Active',
              'Inactive'
          ) DEFAULT 'Active',

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          created_by INT NULL,

          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,

          updated_by INT NULL,

          CONSTRAINT fk_category_department
              FOREIGN KEY (department_id)
              REFERENCES careers_tbl_departments(id)
              ON DELETE CASCADE

      )
    `;

    await db.query(query);

    await createDefaultCategories();

  } catch (error) {
    console.error(
      "Error creating careers_tbl_categories:",
      error.message
    );
  }
};

/* ======================================================
   INSERT DEFAULT CATEGORIES
====================================================== */

const createDefaultCategories = async () => {
  try {

    const categoriesMap = {

      Development: [
        "Web Development",
        "Mobile Development",
        "DevOps & Cloud",
        "Quality Assurance",
        "Database",
        "Architecture",
        "Integration"
      ],

      Design: [
        "UI/UX Design",
        "Graphic Design",
        "Product Design",
        "Motion Graphics",
        "Branding"
      ],

      "Digital Marketing": [
        "SEO",
        "Social Media Marketing",
        "Performance Marketing",
        "Content Marketing",
        "Email Marketing"
      ],

      Media: [
        "Videography",
        "Video Editing",
        "Video Production",
        "Photography",
        "Content Creation",
        "Post Production",
        "Motion Graphics & Animation"
      ]

    };

    for (const departmentName in categoriesMap) {

      const [dept] = await db.query(
        `
        SELECT id
        FROM careers_tbl_departments
        WHERE department_name = ?
        `,
        [departmentName]
      );

      if (dept.length === 0) continue;

      const departmentId = dept[0].id;

      for (const category of categoriesMap[departmentName]) {

        const slug = category
          .toLowerCase()
          .replace(/\s+/g, "-");

        const [existing] = await db.query(
          `
          SELECT id
          FROM careers_tbl_categories
          WHERE category_name = ?
          AND department_id = ?
          `,
          [category, departmentId]
        );

        if (existing.length === 0) {

          await db.query(
            `
            INSERT INTO careers_tbl_categories (
              uuid,
              department_id,
              category_name,
              category_slug,
              status,
              created_by
            )
            VALUES (?, ?, ?, ?, 'Active', 1)
            `,
            [
              uuidv4(),
              departmentId,
              category,
              slug
            ]
          );

        }
      }
    }

  } catch (error) {
    console.error(
      "Error inserting default categories:",
      error.message
    );
  }
};

/* ======================================================
   CREATE BASIC FORM TABLE
====================================================== */

const createCareersBasicFormTable = async () => {
  try {

    const query = `
      CREATE TABLE IF NOT EXISTS careers_tbl_basic_form (

          id INT PRIMARY KEY AUTO_INCREMENT,

          uuid CHAR(36) NOT NULL UNIQUE,

          field_label VARCHAR(150) NOT NULL,

          field_name VARCHAR(150) NOT NULL UNIQUE,

          field_type ENUM(
              'text',
              'email',
              'number',
              'tel',
              'textarea',
              'select',
              'radio',
              'checkbox',
              'file',
              'date',
              'range'
          ) NOT NULL,

          placeholder VARCHAR(255) NULL,

          helper_text VARCHAR(255) NULL,

          field_options JSON NULL,

          is_required BOOLEAN DEFAULT TRUE,

          status ENUM(
              'Active',
              'Inactive'
          ) DEFAULT 'Active',

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          created_by INT NULL,

          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,

          updated_by INT NULL

      )
    `;

    await db.query(query);

    await createDefaultBasicFormFields();

  } catch (error) {
    console.error(
      "Error creating careers_tbl_basic_form:",
      error.message
    );
  }
};

/* ======================================================
   INSERT DEFAULT BASIC FORM FIELDS
====================================================== */

const createDefaultBasicFormFields = async () => {
  try {

    const fields = [

      {
        label: "Full Name",
        name: "full_name",
        type: "text",
        placeholder: "Enter your full name",
        helper: "Please enter your legal full name"
      },

      {
        label: "Email",
        name: "email",
        type: "email",
        placeholder: "Enter your email address",
        helper: "We will contact you via email"
      },

      {
        label: "Phone Number",
        name: "phone_number",
        type: "tel",
        placeholder: "Enter your phone number",
        helper: "Include country code if applicable"
      },

      {
        label: "Resume",
        name: "resume",
        type: "file",
        placeholder: null,
        helper: "Upload PDF or DOC format"
      }

    ];

    for (const field of fields) {

      const [existing] = await db.query(
        `
        SELECT id
        FROM careers_tbl_basic_form
        WHERE field_name = ?
        `,
        [field.name]
      );

      if (existing.length === 0) {

        await db.query(
          `
          INSERT INTO careers_tbl_basic_form (
            uuid,
            field_label,
            field_name,
            field_type,
            placeholder,
            helper_text,
            field_options,
            is_required,
            status,
            created_by
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active', 1)
          `,
          [
            uuidv4(),
            field.label,
            field.name,
            field.type,
            field.placeholder,
            field.helper,
            null,
            true
          ]
        );

      }
    }

  } catch (error) {
    console.error(
      "Error inserting default basic form fields:",
      error.message
    );
  }
};

/* ======================================================
   DEFAULT ROOT ADMIN
====================================================== */

const createDefaultRootUser = async () => {
  try {

    const email = "careers@eparivartan.com";

    const [existing] = await db.query(
      "SELECT id FROM careers_tbl_admins WHERE email = ?",
      [email]
    );

    if (existing.length > 0) return;

    const hashedPassword = await bcrypt.hash(
      "Password@123",
      10
    );

    await db.query(
      `
      INSERT INTO careers_tbl_admins (
        uuid,
        full_name,
        email,
        password,
        role,
        status
      )
      VALUES (?, ?, ?, ?, 'Root Admin', 'Active')
      `,
      [
        uuidv4(),
        "Anand",
        email,
        hashedPassword
      ]
    );

  } catch (error) {
    console.error(
      "Error creating default Root Admin:",
      error.message
    );
  }
};

const createCareersJobsTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS careers_tbl_jobs (
          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          uuid CHAR(36) NOT NULL UNIQUE,
          job_title VARCHAR(250) NOT NULL,
          job_slug VARCHAR(250) NOT NULL UNIQUE,
          department ENUM(
              'Design',
              'Development',
              'Media',
              'Digital Marketing'
          ) NOT NULL,
          category VARCHAR(150) NOT NULL,
          location VARCHAR(150) NOT NULL DEFAULT 'Hyderabad',
          work_type ENUM(
              'On-site',
              'Hybrid',
              'Remote'
          ) NOT NULL,
          employment_type ENUM(
              'Full-time',
              'Part-time',
              'Contract',
              'Internship'
          ) NOT NULL,
          min_experience TINYINT UNSIGNED NOT NULL DEFAULT 0,
          max_experience TINYINT UNSIGNED NOT NULL DEFAULT 0,
          openings INT UNSIGNED NOT NULL DEFAULT 1,
          status ENUM(
              'Draft',
              'Published',
              'Closed'
          ) NOT NULL DEFAULT 'Draft',
          job_description TEXT,
          required_skills JSON DEFAULT (JSON_ARRAY()),
          nice_to_have_skills JSON DEFAULT (JSON_ARRAY()),
          responsibilities JSON DEFAULT (JSON_ARRAY()),
          created_by INT UNSIGNED,
          updated_by INT UNSIGNED,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await db.query(query);
  } catch (error) {
    console.error("Error creating careers_tbl_jobs:", error.message);
  }
};

/* ======================================================
   CREATE ALL TABLES
====================================================== */

const createAllTables = async () => {
  try {

    await createCareersAdminsTable();

    await createCareersDepartmentsTable();

    await createCareersCategoriesTable();

    await createCareersBasicFormTable();

    await createCareersJobsTable();

    console.log("All tables created successfully!");

  } catch (err) {

    console.log(
      "Unable to create the tables",
      err.message
    );

  }
};

module.exports = {
  createAllTables,
  createCareersAdminsTable,
  createCareersDepartmentsTable,
  createCareersCategoriesTable,
  createCareersBasicFormTable,
  createCareersJobsTable
};