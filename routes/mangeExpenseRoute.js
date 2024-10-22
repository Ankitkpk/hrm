const express = require("express");
const router = express.Router();
const multer = require("multer");
const manageExpense = require("../controllers/mangeExpenseController");

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique file name
  },
});

const upload = multer({ storage: storage });

// Route to handle expense creation with file upload
router.post(
  "/manageExpensesForSales/:id",
  upload.single("attachReceipt"),
  manageExpense.createExpenseForSales
);
router.post(
  "/manageExpensesForScreening/:id",
  upload.single("attachReceipt"),
  manageExpense.createExpenseForScreening
);


router.get('/getExpense',manageExpense.getExpense)
router.get('/getExpenseDetails/:id',manageExpense.getExpenseDetails)
router.delete('/deleteExpense/:id',manageExpense.deleteExpense)

router.put(
  "/updateExpenseForSales/:id",
  upload.single("attachReceipt"),
  manageExpense.updateExpenseForSales
);
router.put(
  "/updateExpenseForScreening/:id",
  upload.single("attachReceipt"),
  manageExpense.updateExpenseForScreening
);

module.exports = router;
