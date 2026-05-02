const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/* ======================================================
   CREATE APPLICATION + ANSWERS (TRANSACTION)
====================================================== */

const createApplication = async (req, res) => {
  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    const {
      job_id,
      applicant_name,
      applicant_email,
      applicant_phone,
      resume_file,
      answers,
      created_by
    } = req.body;

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
      SELECT a.*, j.job_title, j.category as job_category
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
   UPDATE APPLICATION STATUS
====================================================== */

const updateApplicationStatus = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      status,
      updated_by
    } = req.body;

    await db.query(
      `
      UPDATE careers_tbl_job_applications
      SET
        status = ?,
        updated_by = ?
      WHERE id = ?
      `,
      [
        status,
        updated_by || null,
        id
      ]
    );

    res.status(200).json({
      success: true,
      message: "Status updated successfully"
    });

  } catch (error) {

    console.error(
      "Update Status Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to update status"
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
  updateApplicationStatus,
  deleteApplication
};