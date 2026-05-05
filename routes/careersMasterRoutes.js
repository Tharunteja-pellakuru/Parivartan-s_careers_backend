const express = require("express");

const router = express.Router();

const {
  getAllDepartments,
  getCategoriesByDepartment,
  getDepartmentsWithCategories,
  addDepartment,
  addCategory,
  updateDepartment,
  deleteDepartment,
  updateCategory,
  deleteCategory,
  getBasicFormFields,
  addBasicFormField,
  updateBasicFormField,
  deleteBasicFormField,
  getAllHiringStages,
  getAllHiringStatus,
  getStatusByStage,
  addHiringStage,
  updateHiringStage,
  deleteHiringStage,
  addHiringStatus
} = require("../controllers/careersMasterController");

/* ======================================================
   ROUTES
===================================================== */

router.get(
  "/departments",
  getAllDepartments
);

router.post(
  "/categories",
  getCategoriesByDepartment
);

router.get(
  "/departments-with-categories",
  getDepartmentsWithCategories
);

router.post(
  "/add-department",
  addDepartment
);

router.put(
  "/update-department/:id",
  updateDepartment
);

router.delete(
  "/delete-department/:id",
  deleteDepartment
);

router.post(
  "/add-category",
  addCategory
);

router.put(
  "/update-category/:id",
  updateCategory
);

router.delete(
  "/delete-category/:id",
  deleteCategory
);

router.get(
  "/basic-form-fields",
  getBasicFormFields
);

router.post(
  "/add-basic-form-field",
  addBasicFormField
);

router.put(
  "/update-basic-form-field/:id",
  updateBasicFormField
);

router.delete(
  "/delete-basic-form-field/:id",
  deleteBasicFormField
);

/* ======================================================
   HIRING STAGES & STATUS ROUTES
====================================================== */

router.get(
  "/hiring-stages",
  getAllHiringStages
);

router.get(
  "/hiring-statuses",
  getAllHiringStatus
);

router.get(
  "/status-by-stage",
  getStatusByStage
);

router.post(
  "/add-hiring-stage",
  addHiringStage
);

router.put(
  "/update-hiring-stage/:id",
  updateHiringStage
);

router.delete(
  "/delete-hiring-stage/:id",
  deleteHiringStage
);

router.post(
  "/add-hiring-status",
  addHiringStatus
);

module.exports = router;