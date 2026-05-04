const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/* ======================================================
   CREATE APPLICATION + ANSWERS (TRANSACTION)
====================================================== */

const createApplication = async (req, res) => {
  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    let {
      job_id,
      applicant_name,
      applicant_email,
      applicant_phone,
      resume_file,
      answers,
      created_by
    } = req.body;

    // Handle parsed JSON if sent as string in FormData
    if (typeof answers === 'string') {
      try {
        answers = JSON.parse(answers);
      } catch (e) {
        answers = [];
      }
    }

    // Process uploaded files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.fieldname === 'resume_file') {
          resume_file = file.path;
        } else {
          // Check if this file corresponds to one of the custom answers
          // We assume the fieldname is the field_id
          const fieldId = file.fieldname;
          
          // Find the answer in the answers array and update its value
          // or add it if it doesn't exist
          const answerIndex = (answers || []).findIndex(a => a.field_id == fieldId);
          if (answerIndex > -1) {
            answers[answerIndex].field_value = file.path;
          } else {
            if (!answers) answers = [];
            answers.push({
              field_id: fieldId,
              field_value: file.path
            });
          }
        }
      });
    }

    /* -----------------------------
       INSERT APPLICATION
    ----------------------------- */

    const applicationQuery = `
      INSERT INTO careers_tbl_job_applications (
        uuid,
        job_id,
        applicant_name,
        applicant_email,
        applicant_phone,
        resume_file,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(
      applicationQuery,
      [
        uuidv4(),
        job_id,
        applicant_name,
        applicant_email,
        applicant_phone,
        resume_file,
        created_by || null
      ]
    );

    const applicationId = result.insertId;

    /* -----------------------------
       INSERT ANSWERS
    ----------------------------- */

    if (answers && answers.length > 0) {

      for (const answer of answers) {

        const answerQuery = `
          INSERT INTO careers_tbl_job_application_answers (
            uuid,
            application_id,
            field_id,
            field_value,
            created_by
          )
          VALUES (?, ?, ?, ?, ?)
        `;

        await connection.query(
          answerQuery,
          [
            uuidv4(),
            applicationId,
            answer.field_id,
            answer.field_value,
            created_by || null
          ]
        );

      }

    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application_id: applicationId
    });

  } catch (error) {

    await connection.rollback();

    console.error(
      "Create Application Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to submit application"
    });

  } finally {

    connection.release();

  }
};

const getAllApplications = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, j.job_title, j.category as job_category, j.department
      FROM careers_tbl_job_applications a
      LEFT JOIN careers_tbl_jobs j ON a.job_id = j.id
      ORDER BY a.created_at DESC
    `);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error("Fetch All Applications Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications"
    });
  }
};

/* ======================================================
   GET APPLICATIONS BY JOB
====================================================== */

const getApplicationsByJob = async (req, res) => {
  try {

    const { job_id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM careers_tbl_job_applications
      WHERE job_id = ?
      ORDER BY created_at DESC
      `,
      [job_id]
    );

    res.status(200).json({
      success: true,
      data: rows
    });

  } catch (error) {

    console.error(
      "Fetch Applications Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications"
    });

  }
};

/* ======================================================
   GET SINGLE APPLICATION WITH ANSWERS
====================================================== */

const getApplicationById = async (req, res) => {
  try {

    const { id } = req.params;

    const [application] = await db.query(
      `
      SELECT a.*, j.job_title
      FROM careers_tbl_job_applications a
      JOIN careers_tbl_jobs j ON j.id = a.job_id
      WHERE a.id = ?
      `,
      [id]
    );

    if (application.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Application not found"
      });

    }

    const [answers] = await db.query(
      `
      SELECT
        a.id,
        a.field_id,
        f.field_name,
        a.field_value
      FROM careers_tbl_job_application_answers a
      JOIN careers_tbl_job_application_fields f
        ON f.id = a.field_id
      WHERE a.application_id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      application: application[0],
      answers
    });

  } catch (error) {

    console.error(
      "Get Application Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch application"
    });

  }
};


/* ======================================================
   DELETE APPLICATION
====================================================== */

const deleteApplication = async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      `
      DELETE FROM careers_tbl_job_applications
      WHERE id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Application deleted successfully"
    });

  } catch (error) {

    console.error(
      "Delete Application Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete application"
    });

  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationsByJob,
  getApplicationById,
  deleteApplication
};