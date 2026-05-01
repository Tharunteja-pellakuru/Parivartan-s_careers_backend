const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/* ======================================================
   CREATE JOB
====================================================== */

const createJob = async (req, res) => {
  try {

    const {
      job_title,
      department,
      category,
      location,
      work_type,
      employment_type,
      min_experience,
      max_experience,
      openings,
      job_description,
      required_skills,
      nice_to_have_skills,
      responsibilities,
      created_by,
      job_slug,
      status
    } = req.body;

    const uuid = uuidv4();

    const final_slug = job_slug || job_title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars
      .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with -
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing -

    await db.query(
      `
      INSERT INTO careers_tbl_jobs (
        uuid,
        job_title,
        job_slug,
        department,
        category,
        location,
        work_type,
        employment_type,
        min_experience,
        max_experience,
        openings,
        job_description,
        required_skills,
        nice_to_have_skills,
        responsibilities,
        created_by,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        uuid,
        job_title,
        final_slug,
        department,
        category,
        location || "Hyderabad",
        work_type === "Onsite" ? "On-site" : work_type,
        employment_type,
        min_experience,
        max_experience,
        openings,
        job_description,
        JSON.stringify(required_skills || []),
        JSON.stringify(nice_to_have_skills || []),
        JSON.stringify(responsibilities || []),
        created_by || 1,
        status || 'Draft'
      ]
    );

    res.status(201).json({
      success: true,
      message: "Job created successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create job"
    });

  }
};



/* ======================================================
   GET ALL JOBS
====================================================== */

const getAllJobs = async (req, res) => {
  try {

    const [jobs] = await db.query(
      `
      SELECT *
      FROM careers_tbl_jobs
      ORDER BY created_at DESC
      `
    );

    res.json({
      success: true,
      data: jobs
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching jobs"
    });

  }
};

/* ======================================================
   GET JOB BY UUID
====================================================== */

const getJobByUUID = async (req, res) => {
  try {

    const { uuid } = req.params;

    const [job] = await db.query(
      `
      SELECT *
      FROM careers_tbl_jobs
      WHERE uuid = ?
      `,
      [uuid]
    );

    if (job.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.json({
      success: true,
      data: job[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching job"
    });

  }
};

/* ======================================================
   UPDATE JOB
====================================================== */

const updateJob = async (req, res) => {
  try {
    const { uuid } = req.params;
    const {
      job_title,
      department,
      category,
      location,
      work_type,
      employment_type,
      min_experience,
      max_experience,
      openings,
      job_description,
      required_skills,
      nice_to_have_skills,
      responsibilities,
      status,
      job_slug
    } = req.body;

    // Build dynamic update query
    let updateFields = [];
    let values = [];

    if (job_title) { updateFields.push("job_title = ?"); values.push(job_title); }
    if (job_slug) { updateFields.push("job_slug = ?"); values.push(job_slug); }
    if (department) { updateFields.push("department = ?"); values.push(department); }
    if (category) { updateFields.push("category = ?"); values.push(category); }
    if (location) { updateFields.push("location = ?"); values.push(location); }
    if (work_type) { updateFields.push("work_type = ?"); values.push(work_type === "Onsite" ? "On-site" : work_type); }
    if (employment_type) { updateFields.push("employment_type = ?"); values.push(employment_type); }
    if (min_experience !== undefined) { updateFields.push("min_experience = ?"); values.push(min_experience); }
    if (max_experience !== undefined) { updateFields.push("max_experience = ?"); values.push(max_experience); }
    if (openings !== undefined) { updateFields.push("openings = ?"); values.push(openings); }
    if (job_description) { updateFields.push("job_description = ?"); values.push(job_description); }
    if (required_skills) { updateFields.push("required_skills = ?"); values.push(JSON.stringify(required_skills)); }
    if (nice_to_have_skills) { updateFields.push("nice_to_have_skills = ?"); values.push(JSON.stringify(nice_to_have_skills)); }
    if (responsibilities) { updateFields.push("responsibilities = ?"); values.push(JSON.stringify(responsibilities)); }
    if (status) { updateFields.push("status = ?"); values.push(status); }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    values.push(uuid);
    
    const [result] = await db.query(
      `UPDATE careers_tbl_jobs SET ${updateFields.join(", ")} WHERE uuid = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({
      success: true,
      message: "Job updated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update job"
    });
  }
};

/* ======================================================
   DELETE JOB
====================================================== */

const deleteJob = async (req, res) => {
  try {
    const { uuid } = req.params;

    const [result] = await db.query(
      `DELETE FROM careers_tbl_jobs WHERE uuid = ?`,
      [uuid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete job"
    });
  }
};


module.exports = {
  createJob,
  getAllJobs,
  getJobByUUID,
  updateJob,
  deleteJob
};