const db = require("../config/db");

/* ======================================================
   GET ALL DEPARTMENTS
====================================================== */

const getAllDepartments = async (req, res) => {
  try {

    const [departments] = await db.query(`
      SELECT
        id,
        uuid,
        department_name,
        department_slug
      FROM careers_tbl_departments
      WHERE status = 'Active'
      ORDER BY department_name ASC
    `);

    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      data: departments
    });

  } catch (error) {

    console.error(
      "Error fetching departments:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments"
    });

  }
};

/* ======================================================
   GET CATEGORIES BY DEPARTMENT
====================================================== */

const getCategoriesByDepartment = async (req, res) => {
  try {

    const department_id = req.body.department_id || req.body.department || req.query.department_id || req.query.department;

    if (!department_id) {
      return res.status(400).json({
        success: false,
        message: "department_id or department is required"
      });
    }

    const [categories] = await db.query(
      `
      SELECT
        id,
        uuid,
        category_name,
        category_slug
      FROM careers_tbl_categories
      WHERE department_id = ?
      AND status = 'Active'
      ORDER BY category_name ASC
      `,
      [department_id]
    );

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories
    });

  } catch (error) {

    console.error(
      "Error fetching categories:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    });

  }
};

/* ======================================================
   GET DEPARTMENTS WITH CATEGORIES
====================================================== */

const getDepartmentsWithCategories = async (req, res) => {
  try {

    const [departments] = await db.query(`
      SELECT 
        id, 
        uuid, 
        department_name, 
        department_slug 
      FROM careers_tbl_departments 
      WHERE status = 'Active' 
      ORDER BY department_name ASC
    `);

    const [categories] = await db.query(`
      SELECT 
        id, 
        uuid, 
        category_name, 
        category_slug, 
        department_id 
      FROM careers_tbl_categories 
      WHERE status = 'Active' 
      ORDER BY category_name ASC
    `);

    const result = departments.map(dept => ({
      ...dept,
      categories: categories.filter(cat => cat.department_id === dept.id)
    }));

    return res.status(200).json({
      success: true,
      message: "Departments with categories fetched successfully",
      data: result
    });

  } catch (error) {

    console.error(
      "Error fetching departments with categories:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments with categories"
    });

  }
};

const { v4: uuidv4 } = require("uuid");

/* ======================================================
   ADD DEPARTMENT
====================================================== */

const addDepartment = async (req, res) => {
  try {
    const { department_name } = req.body;

    if (!department_name) {
      return res.status(400).json({
        success: false,
        message: "Department name is required"
      });
    }

    const slug = department_name.toLowerCase().replace(/\s+/g, "-");

    const [existing] = await db.query(
      "SELECT id FROM careers_tbl_departments WHERE department_name = ? OR department_slug = ?",
      [department_name, slug]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Department already exists"
      });
    }

    await db.query(
      `INSERT INTO careers_tbl_departments (uuid, department_name, department_slug, status)
       VALUES (?, ?, ?, 'Active')`,
      [uuidv4(), department_name, slug]
    );

    return res.status(201).json({
      success: true,
      message: "Department added successfully"
    });

  } catch (error) {
    console.error("Error adding department:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to add department"
    });
  }
};

/* ======================================================
   ADD CATEGORY
====================================================== */

const addCategory = async (req, res) => {
  try {
    const { department_id, category_name } = req.body;

    if (!department_id || !category_name) {
      return res.status(400).json({
        success: false,
        message: "Department ID and category name are required"
      });
    }

    const slug = category_name.toLowerCase().replace(/\s+/g, "-");

    const [existing] = await db.query(
      "SELECT id FROM careers_tbl_categories WHERE category_name = ? AND department_id = ?",
      [category_name, department_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Category already exists in this department"
      });
    }

    await db.query(
      `INSERT INTO careers_tbl_categories (uuid, department_id, category_name, category_slug, status)
       VALUES (?, ?, ?, ?, 'Active')`,
      [uuidv4(), department_id, category_name, slug]
    );

    return res.status(201).json({
      success: true,
      message: "Category added successfully"
    });

  } catch (error) {
    console.error("Error adding category:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to add category"
    });
  }
};

/* ======================================================
   UPDATE DEPARTMENT
====================================================== */

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { department_name } = req.body;

    if (!department_name) {
      return res.status(400).json({
        success: false,
        message: "Department name is required"
      });
    }

    const slug = department_name.toLowerCase().replace(/\s+/g, "-");

    await db.query(
      `UPDATE careers_tbl_departments 
       SET department_name = ?, department_slug = ? 
       WHERE id = ?`,
      [department_name, slug, id]
    );

    return res.status(200).json({
      success: true,
      message: "Department updated successfully"
    });

  } catch (error) {
    console.error("Error updating department:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update department"
    });
  }
};

/* ======================================================
   DELETE DEPARTMENT
====================================================== */

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM careers_tbl_departments WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting department:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete department"
    });
  }
};

/* ======================================================
   UPDATE CATEGORY
====================================================== */

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const slug = category_name.toLowerCase().replace(/\s+/g, "-");

    await db.query(
      `UPDATE careers_tbl_categories 
       SET category_name = ?, category_slug = ? 
       WHERE id = ?`,
      [category_name, slug, id]
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully"
    });

  } catch (error) {
    console.error("Error updating category:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update category"
    });
  }
};

/* ======================================================
   DELETE CATEGORY
====================================================== */

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM careers_tbl_categories WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting category:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category"
    });
  }
};

/* ======================================================
   GET BASIC FORM FIELDS
====================================================== */

const getBasicFormFields = async (req, res) => {
  try {
    const [fields] = await db.query(`
      SELECT 
        id, 
        uuid, 
        field_label, 
        field_name, 
        field_type, 
        placeholder, 
        helper_text, 
        field_options, 
        is_required, 
        status
      FROM careers_tbl_basic_form
      WHERE status = 'Active'
      ORDER BY id ASC
    `);

    return res.status(200).json({
      success: true,
      message: "Basic form fields fetched successfully",
      data: fields
    });

  } catch (error) {
    console.error("Error fetching basic form fields:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch basic form fields"
    });
  }
};

/* ======================================================
   ADD BASIC FORM FIELD
====================================================== */

const addBasicFormField = async (req, res) => {
  try {
    const { field_label, field_name, field_type, placeholder, helper_text, is_required } = req.body;

    if (!field_label || !field_name || !field_type) {
      return res.status(400).json({
        success: false,
        message: "Field label, name and type are required"
      });
    }

    const [existing] = await db.query(
      "SELECT id FROM careers_tbl_basic_form WHERE field_name = ?",
      [field_name]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Field name already exists"
      });
    }

    await db.query(
      `INSERT INTO careers_tbl_basic_form (uuid, field_label, field_name, field_type, placeholder, helper_text, is_required, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')`,
      [uuidv4(), field_label, field_name, field_type, placeholder, helper_text, is_required]
    );

    return res.status(201).json({
      success: true,
      message: "Basic form field added successfully"
    });

  } catch (error) {
    console.error("Error adding basic form field:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to add basic form field"
    });
  }
};

/* ======================================================
   UPDATE BASIC FORM FIELD
====================================================== */

const updateBasicFormField = async (req, res) => {
  try {
    const { id } = req.params;
    const { field_label, field_type, placeholder, helper_text, is_required } = req.body;

    await db.query(
      `UPDATE careers_tbl_basic_form 
       SET field_label = ?, field_type = ?, placeholder = ?, helper_text = ?, is_required = ? 
       WHERE id = ?`,
      [field_label, field_type, placeholder, helper_text, is_required, id]
    );

    return res.status(200).json({
      success: true,
      message: "Basic form field updated successfully"
    });

  } catch (error) {
    console.error("Error updating basic form field:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update basic form field"
    });
  }
};

/* ======================================================
   DELETE BASIC FORM FIELD
====================================================== */

const deleteBasicFormField = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM careers_tbl_basic_form WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Basic form field deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting basic form field:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete basic form field"
    });
  }
};


/* ======================================================
   GET ALL HIRING STAGES
====================================================== */

const getAllHiringStages = async (req, res) => {
  try {

    const [stages] = await db.query(`
      SELECT 
        id,
        uuid,
        name,
        order_index,
        is_final
      FROM careers_tbl_hiring_stages
      WHERE is_active = TRUE
      ORDER BY order_index ASC
    `);

    return res.status(200).json({
      success: true,
      message: "Hiring stages fetched successfully",
      data: stages
    });

  } catch (error) {
    console.error("Error fetching hiring stages:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hiring stages"
    });
  }
};

/* ======================================================
   GET ALL HIRING STATUS
====================================================== */

const getAllHiringStatus = async (req, res) => {
  try {

    const [statuses] = await db.query(`
      SELECT 
        id,
        uuid,
        name
      FROM careers_tbl_hiring_status
      ORDER BY name ASC
    `);

    return res.status(200).json({
      success: true,
      message: "Hiring statuses fetched successfully",
      data: statuses
    });

  } catch (error) {
    console.error("Error fetching hiring statuses:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hiring statuses"
    });
  }
};

/* ======================================================
   GET STATUS BY STAGE (DYNAMIC DROPDOWN)
====================================================== */

const getStatusByStage = async (req, res) => {
  try {

    const stage_id = req.body.stage_id || req.query.stage_id;

    if (!stage_id) {
      return res.status(400).json({
        success: false,
        message: "stage_id is required"
      });
    }

    const [statuses] = await db.query(
      `
      SELECT 
        s.id,
        s.uuid,
        s.name
      FROM careers_tbl_stage_status_mapping m
      JOIN careers_tbl_hiring_status s 
        ON m.status_id = s.id
      WHERE m.stage_id = ?
      ORDER BY s.name ASC
      `,
      [stage_id]
    );

    return res.status(200).json({
      success: true,
      message: "Statuses fetched for stage",
      data: statuses
    });

  } catch (error) {
    console.error("Error fetching statuses by stage:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch statuses"
    });
  }
};

/* ======================================================
   ADD HIRING STAGE
====================================================== */

const addHiringStage = async (req, res) => {
  try {

    const { name, order_index, is_final } = req.body;

    if (!name || !order_index) {
      return res.status(400).json({
        success: false,
        message: "name and order_index are required"
      });
    }

    const [existing] = await db.query(
      "SELECT id FROM careers_tbl_hiring_stages WHERE name = ?",
      [name]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Stage already exists"
      });
    }

    await db.query(
      `
      INSERT INTO careers_tbl_hiring_stages 
      (uuid, name, order_index, is_final, created_by)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        uuidv4(),
        name,
        order_index,
        is_final || 0,
        req.user?.id || 1   // fallback if auth not added
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Stage added successfully"
    });

  } catch (error) {
    console.error("Error adding stage:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to add stage"
    });
  }
};

/* ======================================================
   UPDATE HIRING STAGE
====================================================== */

const updateHiringStage = async (req, res) => {
  try {

    const { id } = req.params;
    const { name, order_index, is_final } = req.body;

    await db.query(
      `
      UPDATE careers_tbl_hiring_stages
      SET name = ?, order_index = ?, is_final = ?, updated_by = ?
      WHERE id = ?
      `,
      [
        name,
        order_index,
        is_final,
        req.user?.id || 1,
        id
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Stage updated successfully"
    });

  } catch (error) {
    console.error("Error updating stage:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update stage"
    });
  }
};

/* ======================================================
   DELETE HIRING STAGE (SOFT DELETE)
====================================================== */

const deleteHiringStage = async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      `
      UPDATE careers_tbl_hiring_stages
      SET is_active = FALSE, updated_by = ?
      WHERE id = ?
      `,
      [
        req.user?.id || 1,
        id
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Stage deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting stage:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete stage"
    });
  }
};

/* ======================================================
   ADD HIRING STATUS
====================================================== */

const addHiringStatus = async (req, res) => {
  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Status name is required"
      });
    }

    const [existing] = await db.query(
      "SELECT id FROM careers_tbl_hiring_status WHERE name = ?",
      [name]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Status already exists"
      });
    }

    await db.query(
      `
      INSERT INTO careers_tbl_hiring_status (uuid, name, created_by)
      VALUES (?, ?, ?)
      `,
      [
        uuidv4(),
        name,
        req.user?.id || 1
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Status added successfully"
    });

  } catch (error) {
    console.error("Error adding status:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to add status"
    });
  }
};


module.exports = {
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
};