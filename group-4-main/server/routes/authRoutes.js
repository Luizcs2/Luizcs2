const express = require("express");
const router = express.Router();
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  forgotPassword,
  verifyUserAndToken,
  resetPassword,
  createForm,
  verifyFormID,
  getAllFormsofUser,
  uploadImage,
  deleteImage,
  saveForm,
  verifyFormForView,
  submitResponse,
  getResponse,
  deleteForm,
} = require("../controllers/authController");

// Middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Uploading an image middleware
const storage = multer.diskStorage({
  destination: "./public",
  filename(req, file, cb) {
    cb(
      null,
      "form-content-questions-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.get("/", test);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:id/:token", verifyUserAndToken);
router.post("/reset-password/:id/:token", resetPassword);
router.post("/create-form", createForm);
router.get("/questionnaire/:formID", verifyFormID);
router.get("/get-user-forms/:userID", getAllFormsofUser);
router.post("/upload-image", upload.single("image"), uploadImage);
router.delete("/delete-image/:imageName", deleteImage);
router.put("/save-form", saveForm);
router.get("/verify-view-form/:formID", verifyFormForView);
router.post("/submit-response", submitResponse);
router.get("/get-response/:formID", getResponse);
router.delete("/delete-form/:formID", deleteForm);
router.get("/get-response-count/:formID", getResponse);

module.exports = router;
