const db = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const createCareersAdminsTable = async () => {
  try {
    console.log("Creating careers_tbl_admins table...");

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

    console.log("careers_tbl_admins table created");

    /* Create default Root Admin */
    await createDefaultRootUser();

  } catch (error) {
    console.error(
      "Error creating careers_tbl_admins:",
      error.message
    );
  }
};


const createDefaultRootUser = async () => {
  try {
    console.log("Checking default Root Admin...");

    const email = "careers@eparivartan.com";

    const uuid = uuidv4()

    /* Check if user already exists */
    const [existing] = await db.query(
      "SELECT id FROM careers_tbl_admins WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      console.log("Root Admin already exists");
      return;
    }

    /* Hash password */
    const hashedPassword = await bcrypt.hash(
      "Password@123",
      10
    );

    /* Insert default user */
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
      VALUES (
        ?,
        ?,
        ?,
        ?,
        'Root Admin',
        'Active'
      )
      `,
      [
        uuid,
        "Anand",
        "careers@eparivartan.com",
        hashedPassword
      ]
    );

    console.log("Default Root Admin created");

  } catch (error) {
    console.error(
      "Error creating default Root Admin:",
      error.message
    );
  }
};


const createAllTables = async () => {
    try {
        await createCareersAdminsTable()
        console.log('Tables created successfully!....')
    }
    catch(err){
        console.log('Unable to create the Tables')
    }
}

module.exports = {
  createAllTables,
  createCareersAdminsTable
};