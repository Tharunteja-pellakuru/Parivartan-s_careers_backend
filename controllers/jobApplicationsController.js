const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../config/mail");
const path = require("path");

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

    const applicationUuid = uuidv4();
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
        applicationUuid,
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

    // Fetch Job Title for Email
    const [jobRows] = await connection.query("SELECT job_title FROM careers_tbl_jobs WHERE id = ?", [job_id]);
    const jobTitle = jobRows[0]?.job_title || "Position";

    await connection.commit();

    // Send Emails
    const adminEmail = "pellakurutharunteja@gmail.com";

    // 1. Email to Admin
    const adminMailOptions = {
      from: process.env.MAIL_USER,
      to: adminEmail,
      subject: `New Application for ${jobTitle}: ${applicant_name}`,
      html: `
        <h2>New Job Application Received</h2>
        <p><strong>Job Position:</strong> ${jobTitle}</p>
        <p><strong>Candidate Name:</strong> ${applicant_name}</p>
        <p><strong>Email:</strong> ${applicant_email}</p>
        <p><strong>Phone:</strong> ${applicant_phone}</p>
        <p>Please check the admin dashboard for the full profile and resume.</p>
      `,
    };

    // 2. Email to Applicant
    const applicantMailOptions = {
      from: process.env.MAIL_USER,
      to: applicant_email,
      subject: `Application Received - ${jobTitle}`,
      html: `
        <h2>Hi ${applicant_name},</h2>
        <p>Thank you for applying for the <strong>${jobTitle}</strong> position at eParivartan.</p>
        <p>We have successfully received your application. Our hiring team will review your profile and if your experience aligns with our requirements, we will reach out to you for the next steps.</p>
        <br>
        <p>Best Regards,</p>
        <p><strong>HR Team</strong></p>
        <p>eParivartan</p>
      `,
    };

    transporter.sendMail(adminMailOptions).catch(err => console.error("Admin Email Error:", err));
    transporter.sendMail(applicantMailOptions).catch(err => console.error("Applicant Email Error:", err));

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

/* ======================================================
   GET ALL APPLICATIONS (LIST)
====================================================== */

const getAllApplications = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, j.job_title 
      FROM careers_tbl_job_applications a
      JOIN careers_tbl_jobs j ON a.job_id = j.id
      ORDER BY a.created_at DESC
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Fetch All Applications Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};

/* ======================================================
   GET APPLICATIONS BY JOB
====================================================== */

const getApplicationsByJob = async (req, res) => {
  try {
    const { job_id } = req.params;
    const [rows] = await db.query(`
      SELECT a.*, j.job_title 
      FROM careers_tbl_job_applications a
      JOIN careers_tbl_jobs j ON a.job_id = j.id
      WHERE a.job_id = ?
      ORDER BY a.created_at DESC
    `, [job_id]);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Fetch Applications By Job Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};

/* ======================================================
   GET APPLICATION BY ID (DETAILS)
====================================================== */

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch basic application info
    const [appRows] = await db.query(`
      SELECT a.*, j.job_title, s.name as stage_name, st.name as status_name
      FROM careers_tbl_job_applications a
      JOIN careers_tbl_jobs j ON a.job_id = j.id
      LEFT JOIN careers_tbl_hiring_stages s ON a.current_stage_id = s.id
      LEFT JOIN careers_tbl_hiring_status st ON a.current_status_id = st.id
      WHERE a.id = ?
    `, [id]);

    if (appRows.length === 0) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Fetch custom answers
    const [answerRows] = await db.query(`
      SELECT ans.*, f.field_name, f.field_type
      FROM careers_tbl_job_application_answers ans
      JOIN careers_tbl_job_application_fields f ON ans.field_id = f.id
      WHERE ans.application_id = ?
    `, [id]);

    res.status(200).json({
      success: true,
      application: appRows[0],
      answers: answerRows
    });

  } catch (error) {
    console.error("Get Application By ID Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch application details" });
  }
};


/* ======================================================
   DELETE APPLICATION
====================================================== */

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM careers_tbl_job_applications WHERE id = ?`, [id]);
    res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete Application Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete application" });
  }
};

/* ======================================================
   UPDATE APPLICATION STAGE & STATUS
====================================================== */

const updateApplicationStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage_id, status_id } = req.body;

    if (!stage_id || !status_id) {
      return res.status(400).json({
        success: false,
        message: "stage_id and status_id are required"
      });
    }

    // Update the stage
    await db.query(
      `
      UPDATE careers_tbl_job_applications
      SET current_stage_id = ?, current_status_id = ?, updated_by = ?
      WHERE id = ?
      `,
      [stage_id, status_id, req.user?.id || 1, id]
    );

    // Fetch Applicant and Stage Details for Email
    const [dataRows] = await db.query(`
      SELECT a.applicant_name, a.applicant_email, j.job_title, s.name as stage_name
      FROM careers_tbl_job_applications a
      JOIN careers_tbl_jobs j ON a.job_id = j.id
      JOIN careers_tbl_hiring_stages s ON s.id = ?
      WHERE a.id = ?
    `, [stage_id, id]);

    if (dataRows.length > 0) {
      const { applicant_name, applicant_email, job_title, stage_name } = dataRows[0];

      const updateMailOptions = {
        from: process.env.MAIL_USER,
        to: applicant_email,
        subject: `Application Update - ${job_title}`,
        html: `
          <h2>Hi ${applicant_name},</h2>
          <p>We are pleased to inform you that your application for the <strong>${job_title}</strong> position has moved to the next stage: <strong>${stage_name}</strong>.</p>
          <p>Our team will contact you shortly with further instructions regarding this round.</p>
          <br>
          <p>Best Regards,</p>
          <p><strong>HR Team</strong></p>
          <p>eParivartan</p>
        `,
      };

      transporter.sendMail(updateMailOptions).catch(err => console.error("Stage Update Email Error:", err));
    }

    res.status(200).json({
      success: true,
      message: "Application stage updated successfully"
    });

  } catch (error) {
    console.error("Update Application Stage Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update application stage"
    });
  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationsByJob,
  getApplicationById,
  updateApplicationStage,
  deleteApplication
};