const express = require("express");

const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobByUUID,
  updateJob,
  deleteJob
} = require("../controllers/jobsController");

/* ======================================================
   JOB ROUTES
====================================================== */

router.post(
  "/jobs",
  createJob
);

router.get(
  "/jobs",
  getAllJobs
);

router.get(
  "/jobs/:uuid",
  getJobByUUID
);

router.put(
  "/jobs/:uuid",
  updateJob
);

router.delete(
  "/jobs/:uuid",
  deleteJob
);

module.exports = router;