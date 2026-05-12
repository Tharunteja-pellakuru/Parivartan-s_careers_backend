const express = require("express");
const router = express.Router();
const { createGeneralApplication, getGeneralApplications, deleteGeneralApplication, getGeneralApplicationByUUID, updateGeneralApplicationStatus } = require("../controllers/generalApplicationController");
const upload = require("../middleware/uploadMiddleware");

router.post("/apply", upload.any(), createGeneralApplication);
router.get("/general-applications", getGeneralApplications);
router.get("/general-applications/:uuid", getGeneralApplicationByUUID);
router.put("/general-applications/:uuid/status", updateGeneralApplicationStatus);
router.delete("/general-applications/:uuid", deleteGeneralApplication);

module.exports = router;
