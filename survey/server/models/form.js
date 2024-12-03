const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./user");

const questionSchema = new Schema({
  open: {
    type: Boolean,
    default: false,
  },
  questionType: {
    type: String,
    enum: [
      "checkbox",
      "multipleChoice",
      "dropdown",
      "fileUpload",
      "shortAnswer",
    ],
  },
  questionText: {
    type: String,
  },
  questionImage: {
    type: String,
    default: "",
  },
  options: [
    {
      optionText: String,
      optionImage: {
        type: String,
        default: "",
      },
    },
  ],
});

// Define the UserForms schema
const FormsSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    description: {
      type: String,
      default: "",
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

const FormModel = mongoose.model("Form", FormsSchema);

module.exports = FormModel;
