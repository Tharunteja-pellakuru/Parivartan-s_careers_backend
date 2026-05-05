const express = require("express");
const router = express.Router();

const {
  createApplication,
  getAllApplications,
  getApplicationsByJob,
  getApplicationById,
  updateApplicationStage,
  deleteApplication
} = require("../controllers/jobApplicationsController.js");

/* ======================================================
   GET ALL APPLICATIONS
====================================================== */

router.get(
  "/",
  getAllApplications
);

const upload = require("../middleware/uploadMiddleware");

/* ======================================================
   CREATE APPLICATION
====================================================== */

router.post(
  "/create",
  upload.any(),
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
   UPDATE APPLICATION STAGE
====================================================== */

router.put(
  "/update-stage/:id",
  updateApplicationStage
);


/* ======================================================
   DELETE APPLICATION
====================================================== */

router.delete(
  "/delete/:id",
  deleteApplication
);

module.exports = router;