const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ImageModel = mongoose.model("Image", imageSchema);

module.exports = ImageModel;
