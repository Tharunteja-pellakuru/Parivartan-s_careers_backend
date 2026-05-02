const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/* ======================================================
   CREATE FIELD
====================================================== */

const createField = async (req, res) => {
  try {
    const {
      job_id,
      step_name,
      step_number,
      field_name,
      field_type,
      placeholder_text,
      helper_text,
      field_options,
      is_required,
      created_by
    } = req.body;

    const query = `
      INSERT INTO careers_tbl_job_application_fields (
        uuid,
        job_id,
        step_name,
        step_number,
        field_name,
        field_type,
        placeholder_text,
        helper_text,
        field_options,
        is_required,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      uuidv4(),
      job_id,
      step_name,
      step_number,
      field_name,
      field_type,
      placeholder_text,
      helper_text,
      JSON.stringify(field_options || null),
      is_required || false,
      created_by || null
    ]);

    res.status(201).json({
      success: true,
      message: "Field created successfully"
    });

  } catch (error) {
    console.error("Create Field Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create field"
    });
  }
};

/* ======================================================
   GET ALL FIELDS BY JOB
====================================================== */

const getFieldsByJob = async (req, res) => {
  try {
    const { job_id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM careers_tbl_job_application_fields
      WHERE job_id = ?
      ORDER BY step_number ASC
      `,
      [job_id]
    );

    res.status(200).json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error("Fetch Fields Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fields"
    });
  }
};

/* ======================================================
   GET SINGLE FIELD
====================================================== */

const getFieldById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM careers_tbl_job_application_fields
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Field not found"
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error("Get Field Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch field"
    });
  }
};

/* ======================================================
   UPDATE FIELD
====================================================== */

const updateField = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      step_name,
      step_number,
      field_name,
      field_type,
      placeholder_text,
      helper_text,
      field_options,
      is_required,
      updated_by
    } = req.body;

    const query = `
      UPDATE careers_tbl_job_application_fields
      SET
        step_name = ?,
        step_number = ?,
        field_name = ?,
        field_type = ?,
        placeholder_text = ?,
        helper_text = ?,
        field_options = ?,
        is_required = ?,
        updated_by = ?
      WHERE id = ?
    `;

    const [result] = await db.query(query, [
      step_name,
      step_number,
      field_name,
      field_type,
      placeholder_text,
      helper_text,
      JSON.stringify(field_options || null),
      is_required || false,
      updated_by || null,
      id
    ]);

    res.status(200).json({
      success: true,
      message: "Field updated successfully"
    });

  } catch (error) {
    console.error("Update Field Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update field"
    });
  }
};

/* ======================================================
   DELETE FIELD
====================================================== */

const deleteField = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM careers_tbl_job_application_fields
      WHERE id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Field deleted successfully"
    });

  } catch (error) {
    console.error("Delete Field Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete field"
    });
  }
};

/* ======================================================
   SYNC ALL FIELDS FOR A JOB
====================================================== */

const syncFields = async (req, res) => {
  let connection;
  try {
    const { job_id, steps } = req.body;

    if (!job_id) {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Delete existing fields for this job
    await connection.query(
      "DELETE FROM careers_tbl_job_application_fields WHERE job_id = ?",
      [job_id]
    );

    // 2. Insert new fields
    const insertQuery = `
      INSERT INTO careers_tbl_job_application_fields (
        uuid, job_id, step_name, step_number, field_name, field_type, 
        placeholder_text, helper_text, field_options, is_required, created_by, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const usedNames = new Set();
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepNumber = i + 1;
      const stepName = step.name;

      for (const question of step.questions) {
        let fieldOptions = question.options || null;
        
        // Handle range type specific options
        if (question.type === 'range') {
          fieldOptions = {
            min: question.min !== undefined ? question.min : 0,
            max: question.max !== undefined ? question.max : 100,
            step: question.step !== undefined ? question.step : 1,
            defaultValue: question.defaultValue !== undefined ? question.defaultValue : 0
          };
        }

        // Generate a unique field name for this job/step (Store exactly as typed)
        let baseName = question.label.trim();
        if (!baseName) baseName = "Field";
        
        let fieldName = baseName;
        let counter = 1;
        while (usedNames.has(fieldName)) {
          fieldName = `${baseName} ${counter}`;
          counter++;
        }
        usedNames.add(fieldName);

        await connection.query(insertQuery, [
          uuidv4(),
          job_id,
          stepName,
          stepNumber,
          fieldName,
          question.type,
          question.placeholder || null,
          question.helpText || null,
          fieldOptions ? JSON.stringify(fieldOptions) : null,
          question.required ? 1 : 0,
          1, // created_by
          1  // updated_by
        ]);
      }
    }

    await connection.commit();
    connection.release();

    res.status(200).json({
      success: true,
      message: "Application fields synced successfully"
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Sync Fields Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to sync application fields"
    });
  }
};

module.exports = {
  createField,
  getFieldsByJob,
  getFieldById,
  updateField,
  deleteField,
  syncFields
};