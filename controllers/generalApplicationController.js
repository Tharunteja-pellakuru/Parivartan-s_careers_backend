const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../config/mail");
const path = require("path");

const createGeneralApplication = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      phone,
      experience,
      portfolio,
      reason,
    } = req.body;

    const fullName = `${firstName} ${lastName}`;
    let resume_file = "";

    // Process uploaded resume
    if (req.files && req.files.length > 0) {
      const file = req.files.find(f => f.fieldname === 'resume');
      if (file) {
        resume_file = file.path;
      }
    }

    const uuid = uuidv4();

    const query = `
      INSERT INTO careers_tbl_general_applications (
        uuid,
        full_name,
        email,
        phone_number,
        experience,
        portfolio_url,
        resume_file,
        reason_to_join
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      uuid,
      fullName,
      email,
      phone,
      experience,
      portfolio || null,
      resume_file,
      reason || null,
    ]);

    // Send Emails
    const adminEmail = "pellakurutharunteja@gmail.com"; // Admin email from previous context or generic

    // 1. Email to Admin
    const adminMailOptions = {
      from: process.env.MAIL_USER,
      to: adminEmail,
      subject: `New General Application: ${fullName}`,
      html: `
        <h2>New General Application Received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Experience:</strong> ${experience}</p>
        <p><strong>Portfolio:</strong> ${portfolio || "N/A"}</p>
        <p><strong>Message/Reason:</strong> ${reason || "N/A"}</p>
        <p>Please check the admin panel for more details and to download the resume.</p>
      `,
    };

    // 2. Email to User
    const userMailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Submission Received - eParivartan Careers",
      html: `
        <h2>Hi ${firstName},</h2>
        <p>Thank you for your direct submission to eParivartan.</p>
        <p>We have received your details and our HR team will review them. If your profile matches any of our current or future requirements, we will get in touch with you.</p>
        <br>
        <p>Best Regards,</p>
        <p><strong>HR Team</strong></p>
        <p>eParivartan</p>
      `,
    };

    // Send emails asynchronously
    transporter.sendMail(adminMailOptions).catch(err => console.error("Admin Email Error:", err));
    transporter.sendMail(userMailOptions).catch(err => console.error("User Email Error:", err));

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });

  } catch (error) {
    console.error("General Application Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};

const getGeneralApplications = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM careers_tbl_general_applications
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Fetch General Applications Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch general applications",
    });
  }
};

const deleteGeneralApplication = async (req, res) => {
  try {
    const { uuid } = req.params;
    await db.query("DELETE FROM careers_tbl_general_applications WHERE uuid = ?", [uuid]);

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete General Application Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete application",
    });
  }
};

const getGeneralApplicationByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM careers_tbl_general_applications WHERE uuid = ?",
      [uuid]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Fetch General Application Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch general application",
    });
  }
};

const updateGeneralApplicationStatus = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { status } = req.body;

    await db.query(
      "UPDATE careers_tbl_general_applications SET status = ? WHERE uuid = ?",
      [status, uuid]
    );

    // Fetch Candidate Details for Email
    const [dataRows] = await db.query(`
      SELECT full_name, email FROM careers_tbl_general_applications WHERE uuid = ?
    `, [uuid]);

    if (dataRows.length > 0) {
      const { full_name, email } = dataRows[0];

      const updateMailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Application Status Update - eParivartan",
        html: `
          <h2>Hi ${full_name},</h2>
          <p>We wanted to update you on your general application status at eParivartan.</p>
          <p>Your application status has been updated to: <strong>${status}</strong>.</p>
          <p>Our HR team will reach out to you if there are further steps required.</p>
          <br>
          <p>Best Regards,</p>
          <p><strong>HR Team</strong></p>
          <p>eParivartan</p>
        `,
      };

      transporter.sendMail(updateMailOptions).catch(err => console.error("General Status Update Email Error:", err));
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("Update General Application Status Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};

module.exports = {
  createGeneralApplication,
  getGeneralApplications,
  deleteGeneralApplication,
  getGeneralApplicationByUUID,
  updateGeneralApplicationStatus,
};
