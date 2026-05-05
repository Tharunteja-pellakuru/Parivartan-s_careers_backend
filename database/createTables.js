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
      CREATE JOB APPLICATION FIELDS TABLE
    ====================================================== */

    const createCareersJobApplicationFieldsTable = async () => {
      try {

        const query = `
          CREATE TABLE IF NOT EXISTS careers_tbl_job_application_fields (

              id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

              uuid CHAR(36) NOT NULL UNIQUE,

              job_id INT UNSIGNED NOT NULL,

              step_name VARCHAR(150) NOT NULL,

              step_number INT UNSIGNED NOT NULL,

              field_name VARCHAR(150) NOT NULL,

              field_type ENUM(
                  'text',
                  'email',
                  'number',
                  'textarea',
                  'select',
                  'radio',
                  'checkbox',
                  'file',
                  'date',
                  'phone',
                  'url',
                  'toggle',
                  'range'
              ) NOT NULL,

              placeholder_text VARCHAR(255) NULL,

              helper_text VARCHAR(255) NULL,

              field_options JSON NULL,

              is_required BOOLEAN DEFAULT FALSE,

              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

              created_by INT NULL,

              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,

              updated_by INT NULL,

              CONSTRAINT fk_job_application_fields_job
                  FOREIGN KEY (job_id)
                  REFERENCES careers_tbl_jobs(id)
                  ON DELETE CASCADE,

              UNIQUE KEY unique_job_step_field (
                  job_id,
                  step_number,
                  field_name
              )

          )
        `;

        await db.query(query);

      } catch (error) {
        console.error(
          "Error creating careers_tbl_job_application_fields:",
          error.message
        );
      }
    };



    /* ======================================================
   CREATE JOB APPLICATIONS TABLE
====================================================== */

const createCareersJobApplicationsTable = async () => {
  try {

    const query = `
      CREATE TABLE IF NOT EXISTS careers_tbl_job_applications (

          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

          uuid CHAR(36) NOT NULL UNIQUE,

          job_id INT UNSIGNED NOT NULL,

          applicant_name VARCHAR(150) NOT NULL,

          applicant_email VARCHAR(150) NOT NULL,

          applicant_phone VARCHAR(20) NULL,

          resume_file VARCHAR(255) NULL,
          current_stage_id INT UNSIGNED NULL,
          current_status_id INT UNSIGNED NULL,


          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          created_by INT NULL,

          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,

          updated_by INT NULL,

          CONSTRAINT fk_application_job
              FOREIGN KEY (job_id)
              REFERENCES careers_tbl_jobs(id)
              ON DELETE CASCADE,

          CONSTRAINT fk_application_stage
              FOREIGN KEY (current_stage_id)
              REFERENCES careers_tbl_hiring_stages(id)
              ON DELETE SET NULL,

          CONSTRAINT fk_application_status
              FOREIGN KEY (current_status_id)
              REFERENCES careers_tbl_hiring_status(id)
              ON DELETE SET NULL

      )
    `;

    await db.query(query);

    console.log("careers_tbl_job_applications created");

  } catch (error) {
    console.error(
      "Error creating careers_tbl_job_applications:",
      error.message
    );
  }
};


/* ======================================================
   CREATE JOB APPLICATION ANSWERS TABLE
====================================================== */

const createCareersJobApplicationAnswersTable = async () => {
  try {

    const query = `
      CREATE TABLE IF NOT EXISTS careers_tbl_job_application_answers (

          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

          uuid CHAR(36) NOT NULL UNIQUE,

          application_id INT UNSIGNED NOT NULL,

          field_id INT UNSIGNED NOT NULL,

          field_value TEXT NULL,

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          created_by INT NULL,

          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,

          updated_by INT NULL,

          CONSTRAINT fk_application_answers_application
              FOREIGN KEY (application_id)
              REFERENCES careers_tbl_job_applications(id)
              ON DELETE CASCADE,

          CONSTRAINT fk_application_answers_field
              FOREIGN KEY (field_id)
              REFERENCES careers_tbl_job_application_fields(id)
              ON DELETE CASCADE

      )
    `;

    await db.query(query);

    console.log("careers_tbl_job_application_answers created");

  } catch (error) {
    console.error(
      "Error creating careers_tbl_job_application_answers:",
      error.message
    );
  }
};




/* ======================================================
  CREATE HIRING STAGES TABLE
====================================================== */

const createCareersHiringStagesTable = async () => {
  try {

    const query = `
      CREATE TABLE IF NOT EXISTS careers_tbl_hiring_stages (

          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

          uuid CHAR(36) NOT NULL UNIQUE,

          name VARCHAR(150) NOT NULL UNIQUE,

          order_index INT NOT NULL,

          is_final BOOLEAN DEFAULT FALSE,

          is_active BOOLEAN DEFAULT TRUE,

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          created_by INT NULL,

          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,

          updated_by INT NULL

      )
    `;

    await db.query(query);

    await createDefaultHiringStages();

    console.log("careers_tbl_hiring_stages created");

  } catch (error) {
    console.error(
      "Error creating careers_tbl_hiring_stages:",
      error.message
    );
  }
};



/* ======================================================
  INSERT DEFAULT HIRING STAGES
====================================================== */

const createDefaultHiringStages = async () => {
  try {

    const stages = [
      "Application Submission",
      "Application Received",
      "Resume Screening",
      "Technical Test",
      "Technical Interview",
      "Managerial Round",
      "HR Final Round",
      "Offer Preparation",
      "Offer Issued",
      "Offer Accepted",
      "Joining",
      "Rejected"
    ];

    let order = 1;

    for (const stage of stages) {

      const [existing] = await db.query(
        "SELECT id FROM careers_tbl_hiring_stages WHERE name = ?",
        [stage]
      );

      if (existing.length === 0) {

        await db.query(
          `
          INSERT INTO careers_tbl_hiring_stages (
            uuid,
            name,
            order_index,
            is_final,
            created_by
          )
          VALUES (?, ?, ?, ?, 1)
          `,
          [
            uuidv4(),
            stage,
            order,
            stage === "Joining" || stage === "Rejected" ? 1 : 0
          ]
        );

      }

      order++;
    }

  } catch (error) {
    console.error(
      "Error inserting default hiring stages:",
      error.message
    );
  }
};  


/* ======================================================
  CREATE HIRING STATUS TABLE
====================================================== */

const createCareersHiringStatusTable = async () => {
  try {

    const query = `
      CREATE TABLE IF NOT EXISTS careers_tbl_hiring_status (

          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

          uuid CHAR(36) NOT NULL UNIQUE,

          name VARCHAR(100) NOT NULL UNIQUE,

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          created_by INT NULL,

          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,

          updated_by INT NULL

      )
    `;

    await db.query(query);

    await createDefaultHiringStatuses();

    console.log("careers_tbl_hiring_status created");

  } catch (error) {
    console.error(
      "Error creating careers_tbl_hiring_status:",
      error.message
    );
  }
};


/* ======================================================
  INSERT DEFAULT HIRING STATUSES
====================================================== */

const createDefaultHiringStatuses = async () => {
  try {

    const statuses = [
      "Pending",
      "Completed",
      "Hold",
      "In Progress",
      "Cleared",
      "Rejected",
      "Failed",
      "Successfully"
    ];

    for (const status of statuses) {

      const [existing] = await db.query(
        "SELECT id FROM careers_tbl_hiring_status WHERE name = ?",
        [status]
      );

      if (existing.length === 0) {

        await db.query(
          `
          INSERT INTO careers_tbl_hiring_status (
            uuid,
            name,
            created_by
          )
          VALUES (?, ?, 1)
          `,
          [
            uuidv4(),
            status
          ]
        );

      }

    }

  } catch (error) {
    console.error(
      "Error inserting default hiring statuses:",
      error.message
    );
  }
};




/* ======================================================
  CREATE STAGE STATUS MAPPING TABLE
====================================================== */

const createStageStatusMappingTable = async () => {
  try {

    const query = `
      CREATE TABLE IF NOT EXISTS careers_tbl_stage_status_mapping (

          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

          uuid CHAR(36) NOT NULL UNIQUE,

          stage_id INT UNSIGNED NOT NULL,

          status_id INT UNSIGNED NOT NULL,

          CONSTRAINT fk_mapping_stage
              FOREIGN KEY (stage_id)
              REFERENCES careers_tbl_hiring_stages(id)
              ON DELETE CASCADE,

          CONSTRAINT fk_mapping_status
              FOREIGN KEY (status_id)
              REFERENCES careers_tbl_hiring_status(id)
              ON DELETE CASCADE,

          UNIQUE KEY unique_stage_status (stage_id, status_id)

      )
    `;

    await db.query(query);

    await createDefaultStageStatusMapping();

    console.log("careers_tbl_stage_status_mapping created");

  } catch (error) {
    console.error(
      "Error creating careers_tbl_stage_status_mapping:",
      error.message
    );
  }
};


/* ======================================================
  INSERT DEFAULT STAGE-STATUS MAPPING
====================================================== */

const createDefaultStageStatusMapping = async () => {
  try {

    const mappings = [

      // Application Submission → Completed
      { stage: 1, status: 2 },

      // Application Received → Successfully
      { stage: 2, status: 8 },

      // Resume Screening
      { stage: 3, status: 1 },
      { stage: 3, status: 2 },
      { stage: 3, status: 3 },
      { stage: 3, status: 4 },
      { stage: 3, status: 5 },
      { stage: 3, status: 6 },
      { stage: 3, status: 7 },

      // Technical Test
      { stage: 4, status: 1 },
      { stage: 4, status: 2 },
      { stage: 4, status: 3 },
      { stage: 4, status: 4 },
      { stage: 4, status: 5 },
      { stage: 4, status: 6 },
      { stage: 4, status: 7 },

      // Technical Interview
      { stage: 5, status: 1 },
      { stage: 5, status: 2 },
      { stage: 5, status: 3 },
      { stage: 5, status: 4 },
      { stage: 5, status: 5 },
      { stage: 5, status: 6 },
      { stage: 5, status: 7 },

      // Managerial Round
      { stage: 6, status: 1 },
      { stage: 6, status: 2 },
      { stage: 6, status: 3 },
      { stage: 6, status: 4 },
      { stage: 6, status: 5 },
      { stage: 6, status: 6 },
      { stage: 6, status: 7 },

      // HR Final Round
      { stage: 7, status: 1 },
      { stage: 7, status: 2 },
      { stage: 7, status: 3 },
      { stage: 7, status: 4 },
      { stage: 7, status: 5 },
      { stage: 7, status: 6 },
      { stage: 7, status: 7 },

      // Offer Preparation
      { stage: 8, status: 1 },
      { stage: 8, status: 2 },
      { stage: 8, status: 3 },
      { stage: 8, status: 4 },

      // Final Stages
      { stage: 9, status: 2 },  // Offer Issued → Completed
      { stage: 10, status: 2 }, // Offer Accepted → Completed
      { stage: 11, status: 2 }, // Joining → Completed
      { stage: 12, status: 6 }  // Rejected → Rejected

    ];

    for (const map of mappings) {

      const [existing] = await db.query(
        `
        SELECT id FROM careers_tbl_stage_status_mapping
        WHERE stage_id = ? AND status_id = ?
        `,
        [map.stage, map.status]
      );

      if (existing.length === 0) {

        await db.query(
          `
          INSERT INTO careers_tbl_stage_status_mapping (
            uuid,
            stage_id,
            status_id
          )
          VALUES (?, ?, ?)
          `,
          [
            uuidv4(),
            map.stage,
            map.status
          ]
        );

      }

    }

  } catch (error) {
    console.error(
      "Error inserting stage-status mapping:",
      error.message
    );
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

        await createCareersJobApplicationFieldsTable();

        await createCareersJobApplicationsTable();

        await createCareersJobApplicationAnswersTable();

        await createCareersHiringStagesTable();

        await createCareersHiringStatusTable();

        await createStageStatusMappingTable();

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
      createCareersJobsTable,
      createCareersJobApplicationsTable,
      createCareersJobApplicationAnswersTable,
      createCareersHiringStagesTable,
      createCareersHiringStatusTable,
      createStageStatusMappingTable
    };