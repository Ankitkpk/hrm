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

// // Route to handle expense creation with file upload
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
  router.post(
    "/manageExpenseForGifts",
    upload.single("receipt"),
    manageExpense.manageExpenseForGifts,
  );
  router.post(
    "/manageExpenseForStationary",
    upload.single("receipt"),
    manageExpense.manageExpenseForStationary,
  );
  router.post(
    "/addFoodExpense",
    upload.single("receipt"),
    manageExpense.addFoodExpense,
  );
  router.post(
    "/addTravelExpense",
    upload.single("receipt"),
    manageExpense.addTravelExpense,
  );
  router.post(
    "/manageExpenseForOther",
    upload.single("receipt"),
    manageExpense.manageExpenseForOther,
  );
  router.get('/getExpensesByQuery',manageExpense.getExpensesByQuery)
  router.get('/getExpenseDetails/:id',manageExpense.getExpenseDetails)
  router.delete('/deleteExpense/:id',manageExpense.deleteExpense)
  router.get('/getExpenseHistory',manageExpense.getExpenseHistory)

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
 //router.get("/getExpenseCategory" , manageExpense.getExpenseCategory);
 module.exports = router;
