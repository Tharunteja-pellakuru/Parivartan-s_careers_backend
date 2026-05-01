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
  deleteBasicFormField
} = require("../controllers/careersMasterController");

/* ======================================================
   ROUTES
====================================================== */

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

module.exports = router;