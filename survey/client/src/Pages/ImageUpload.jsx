import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// import { toast } from 'react-hot-toast';
import axios from "axios";

export default function ImageUpload({
  handleImagePopOpen,
  handleImagePopClose,
  updateImageLink,
  contextData,
}) {
  const [image, setImage] = useState(undefined);
  const [imageWarning, setImageWarning] = useState("");

  useEffect(() => {
    setImageWarning("");
  }, [handleImagePopClose]);

  const uploadImage = async () => {
    // console.log(contextData);
    // console.log(image);
    // console.log(image.size);

    if (image.size > 3110670 && image.type.startsWith("image/")) {
      setImageWarning("Image Size is too big");
    } else if (!image.type.startsWith("image/")) {
      setImageWarning("Only Image Files are supported");
    } else {
      const imageData = new FormData();
      imageData.append("image", image);

      try {
        const { data } = await axios.post("/upload-image", imageData);

        const imageLink = data.host + "/" + data.image;

        // console.log("Image Link: " + imageLink)

        handleImagePopClose();
        updateImageLink(imageLink, contextData);
      } catch (error) {
        console.log("Image Upload Error: " + error);
      }
    }
  };

  return (
    <div>
      <Dialog
        open={handleImagePopOpen}
        onClose={handleImagePopClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Upload Image Here</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Upload an image to be used for the question/option
          </DialogContentText>
          <TextField
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {imageWarning !== "" ? <p>{imageWarning}</p> : ""}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleImagePopClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={uploadImage}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
