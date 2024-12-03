const mongoose = require("mongoose");
const { Schema } = mongoose;
const Form = require("./form");

const responseSchema = new Schema(
  {
    formID: {
      type: Schema.Types.ObjectId,
      ref: "Form",
    },

    userID: {
      type: String,
    },

    response: [
      {
        questionID: String,
        answer: {
          type: Schema.Types.Mixed,
          validate: {
            validator: function (value) {
              if (typeof value === "string") return true;
              if (
                Array.isArray(value) &&
                value.every((v) => typeof v === "string")
              )
                return true;
              return false;
            },
            message: (props) =>
              `${props.value} is not a valid response format!`,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

const ResponseModel = mongoose.model("Response", responseSchema);

module.exports = ResponseModel;
