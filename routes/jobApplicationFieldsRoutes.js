const express = require("express");
const router = express.Router();

const {
  createField,
  getFieldsByJob,
  getFieldById,
  updateField,
  deleteField,
  syncFields
} = require("../controllers/ApplicationFieldsController");

/* ======================================================
   SYNC FIELDS
====================================================== */

router.post(
  "/sync",
  syncFields
);

/* ======================================================
   CREATE FIELD
====================================================== */

router.post(
  "/create",
  createField
);

/* ======================================================
   GET ALL FIELDS BY JOB
====================================================== */

router.get(
  "/job/:job_id",
  getFieldsByJob
);

/* ======================================================
   GET SINGLE FIELD
====================================================== */

router.get(
  "/:id",
  getFieldById
);

/* ======================================================
   UPDATE FIELD
====================================================== */

router.put(
  "/update/:id",
  updateField
);

/* ======================================================
   DELETE FIELD
====================================================== */

router.delete(
  "/delete/:id",
  deleteField
);

module.exports = router;