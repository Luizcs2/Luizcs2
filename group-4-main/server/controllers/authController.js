const User = require("../models/user");
const Form = require("../models/form");
const Image = require("../models/image");
const Response = require("../models/response");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../helpers/email");
const puppeteer = require("puppeteer");

const BASE_URL = "http://localhost:5173";

const test = (req, res) => {
  res.json({ test: "test is working" });
};

// Register Endpoint
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if name was entered
    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }

    // Check of password is good
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }

    // Check Email
    const exist = await User.findOne({ email });

    if (exist) {
      return res.json({
        error: "Email is already taken",
      });
    }

    const hashedPassword = await hashPassword(password);

    // Create user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

// Login Endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        error: "No user found",
      });
    }

    // Check if the password match
    const match = await comparePassword(password, user.password);

    if (match) {
      const userInfo = {
        email: user.email,
        id: user._id,
        name: user.name,
      };

      jwt.sign(userInfo, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) {
          throw err;
        }
        res.cookie("token", token).json(userInfo);
      });
    } else {
      res.json({
        error: "Password do not match",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) {
        throw err;
      }
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

const logoutUser = (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.clearCookie("token");
        res.json({ error: "Invalid token" });
      } else {
        res.clearCookie("token");
        res.json({ message: "Logged out" });
      }
    });
  } else {
    res.json({ error: "No token provided" });
  }
};

// Forgot Password Endpoint
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        error: "No user found. Please try again.",
      });
    } else {
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id,
          name: user.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );

      const link = `${BASE_URL}/reset-password/${user._id}/${token}`;

      const message = `We have received a password reset request. Please use the below link to reset your password\n\n${link}\n\nThis password reset link will be only valid for 10 minutes.`;

      console.log(link);

      try {
        await sendEmail({
          email: user.email,
          // email: process.env.EMAIL_USER, // For testing
          subject: "Password Reset Request",
          message: message,
        });

        res.json({
          message: "Password reset mail sent successfully!",
        });
      } catch (error) {
        console.log("Error with sending reset password mail: " + error);

        return res.json({
          error: "Error sending password reset mail.",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyUserAndToken = async (req, res) => {
  try {
    const { id, token } = req.params;

    // Check if user exists
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.json({
        error: "No user found. Please check the link.",
      });
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          res.json({ error: "Invalid Token" });
        } else {
          res.json({ message: "Verified" });
        }
      });
    }
  } catch (error) {
    res.json({
      error: "Invalid Token",
    });
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }

    // Check if user exists
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.json({
        error: "User does not exist",
      });
    } else {
      jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
          res.json({ error: "Invalid Token" });
        } else {
          const hashedPassword = await hashPassword(password);

          //Update password in MongoDB
          await User.updateOne(
            { _id: id },
            { $set: { password: hashedPassword } }
          );

          res.json({ message: "Password Updated Successfully" });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const createForm = async (req, res) => {
  try {
    const { formData } = req.body;

    // console.log("User: " + formData.createdBy)

    const newForm = await Form.create({
      createdBy: formData.createdBy,
      name: formData.name,
      description: formData.description,
    });

    if (newForm) {
      const updatedUser = await User.updateOne(
        { _id: formData.createdBy },
        { $push: { createdForms: newForm._id } }
      );

      // console.log("Updated User:\n\n" + JSON.stringify(updatedUser))
      // console.log("Created Form:\n\n" + newForm)

      const link = `/questionnaire/${newForm._id}`;

      // console.log(link)

      res.json({
        message: "Form created successfully",
        link: link,
      });
    } else {
      res.json({ error: "Form creation failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({
      error: "Please try again",
    });
  }
};

const verifyFormID = async (req, res) => {
  try {
    const { formID } = req.params;
    const { token } = req.cookies;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
        if (err) {
          throw err;
        }

        // const userId = user.id;
        const foundUser = await User.findById(user.id);

        if (foundUser && foundUser.createdForms.includes(formID)) {
          const form = await Form.findById(formID);
          res.json({ formDetails: form });
        } else {
          res.json({ error: "User does not have access to this form" });
        }
      });
    } else {
      res.json({ loginError: "Please log in" });
    }
  } catch (error) {
    res.json({
      error: "Error occured during Form Verification",
    });
    console.log(error);
  }
};

const getAllFormsofUser = async (req, res) => {
  try {
    const { userID } = req.params;

    const user = await User.findOne({ _id: userID });

    if (user) {
      const forms = await Form.find().where("_id").in(user.createdForms);

      // console.log("Forms: \n\n" + forms)

      res.json({
        forms: forms,
      });
    } else {
      res.json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const uploadImage = async (req, res) => {
  try {
    // const meta = req.body;

    const imageFile = await Image.create({
      image: req.file.filename,
    });

    // console.log("Database saved file name: " + imageFile)

    res.json({
      image: imageFile.image,
      host: req.protocol + "://" + req.get("host") + "/image",
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteImage = async (req, res) => {
  try {
    const { imageName } = req.params;

    // Find the image document in the database
    const imageDoc = await Image.findOne({ image: imageName });

    if (!imageDoc) {
      console.log("Image not found");
      return;
    }

    // Construct the file path
    const filePath = path.join(__dirname, "..", "public", imageDoc.image);

    // Delete the file from the filesystem
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Error deleting file: " + err);
      }

      // Delete the image document from the database
      await Image.deleteOne({ image: imageName });

      // console.log('Image deleted:', imageName)
    });
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

const saveForm = async (req, res) => {
  try {
    const { formDetails } = req.body;
    const formID = formDetails.formID;

    const newFormData = {
      name: formDetails.name,
      description: formDetails.description,
      questions: formDetails.questions,
    };

    const updatedForm = await Form.findByIdAndUpdate(formID, newFormData, {
      new: true,
    });

    // console.log(JSON.stringify(updatedForm) + "\n\n")

    if (updatedForm) {
      res.json({
        message: "Form Saved Successfully",
        questions: updatedForm.questions,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyFormForView = async (req, res) => {
  try {
    const { formID } = req.params;

    const form = await Form.findById(formID);

    if (form) {
      res.json({ formDetails: form });
    } else {
      res.json({ error: "Please Verify the Link Again" });
    }
  } catch (error) {
    res.json({
      error: "Please Verify the Link Again",
    });
    console.log(error);
  }
};

const submitResponse = async (req, res) => {
  try {
    const { submissionData } = req.body;

    var newResponseData = {
      formID: submissionData.formID,
      userID: submissionData.userID,
      response: submissionData.response,
    };

    if (newResponseData.response.length > 0) {
      const savedResponse = await Response.create(newResponseData);
      // console.log(savedResponse)
      if (savedResponse) {
        res.json({ message: "Response Saved" });
      }
    } else {
      res.json({ error: "Please fill atleast one field" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getResponse = async (req, res) => {
  try {
    const { formID } = req.params;

    const responses = await Response.find({ formID: formID });
    // console.log(responses)

    if (responses) {
      res.json({
        responseData: responses,
        responseCount: responses.length,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteForm = async (req, res) => {
  try {
    const { formID } = req.params;

    const deletedForm = await Form.deleteOne({ _id: formID });
    // console.log(deletedForm)

    if (deletedForm.deletedCount === 0) {
      return res.json({ error: "Form not found" });
    }

    res.json({ message: "Form Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ error: "Error deleting form" });
  }
};

const getResponseCount = async (req, res) => {
  try {
    const { formID } = req.params;

    const resCount = await Response.countDocuments({ formID: formID });

    res.json({
      responseCount: resCount,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
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
  getResponseCount,
};
