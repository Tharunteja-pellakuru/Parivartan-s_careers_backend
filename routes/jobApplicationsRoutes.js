const express = require("express");
const router = express.Router();

const {
  createApplication,
  getAllApplications,
  getApplicationsByJob,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} = require("../controllers/jobApplicationsController.js");

/* ======================================================
   GET ALL APPLICATIONS
====================================================== */

router.get(
  "/",
  getAllApplications
);

/* ======================================================
   CREATE APPLICATION
====================================================== */

router.post(
  "/create",
  createApplication
);

/* ======================================================
   GET APPLICATIONS BY JOB
====================================================== */

router.get(
  "/job/:job_id",
  getApplicationsByJob
);

/* ======================================================
   GET SINGLE APPLICATION
====================================================== */

router.get(
  "/:id",
  getApplicationById
);

/* ======================================================
   UPDATE STATUS
====================================================== */

router.put(
  "/status/:id",
  updateApplicationStatus
);

/* ======================================================
   DELETE APPLICATION
====================================================== */

router.delete(
  "/delete/:id",
  deleteApplication
);

module.exports = router;