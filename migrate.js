const db = require("./config/db");

const migrate = async () => {
  try {
    console.log("Starting migration...");
    
    // Check if columns already exist
    const [columns] = await db.query("SHOW COLUMNS FROM careers_tbl_job_applications LIKE 'current_stage_id'");
    
    if (columns.length === 0) {
      console.log("Adding current_stage_id and current_status_id columns...");
      await db.query(`
        ALTER TABLE careers_tbl_job_applications 
        ADD COLUMN current_stage_id INT UNSIGNED NULL, 
        ADD COLUMN current_status_id INT UNSIGNED NULL
      `);
      
      console.log("Adding foreign key constraints...");
      await db.query(`
        ALTER TABLE careers_tbl_job_applications
        ADD CONSTRAINT fk_application_stage
        FOREIGN KEY (current_stage_id)
        REFERENCES careers_tbl_hiring_stages(id)
        ON DELETE SET NULL
      `);
      
      await db.query(`
        ALTER TABLE careers_tbl_job_applications
        ADD CONSTRAINT fk_application_status
        FOREIGN KEY (current_status_id)
        REFERENCES careers_tbl_hiring_status(id)
        ON DELETE SET NULL
      `);
      
      console.log("Migration completed successfully!");
    } else {
      console.log("Columns already exist, skipping migration.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
};

migrate();
