import {
  Grid,
  Paper,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
  Radio,
  FormControlLabel,
  AccordionActions,
  Divider,
  CircularProgress,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageUpload from "./ImageUpload";
import "./CSS/QuestionTab.css";

export default function QuestionTab({ formData, onFormSaved }) {
  const navigate = useNavigate();
  const [hasChanges, setHasChanges] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [loadingFormData, setLoadingFormData] = useState(true);
  const [openUploadImagePop, setOpenUploadImagePop] = useState(false);
  const [imageContextData, setImageContextData] = useState({
    question: null,
    option: null,
  });

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasChanges) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);

  useEffect(() => {
    if (formData.questions !== undefined) {
      if (formData.questions.length === 0) {
        setQuestions([
          {
            questionType: "multipleChoice",
            questionText: "",
            options: [{ optionText: "Option 1" }],
            open: true,
          },
        ]);
        // console.log("Empty questions set")
      } else {
        setQuestions(formData.questions);
        // console.log("Form data questions set")
      }
      setLoadingFormData(false);
    }
  }, [formData]);

  const saveForm = async () => {
    const formDetails = {
      formID: formData._id,
      name: formData.name,
      description: formData.description,
      questions: questions,
    };

    const { data } = await axios.put("/save-form", { formDetails });

    if (data.message) {
      toast.success(data.message);
      setQuestions(data.questions);
      setHasChanges(false);
      onFormSaved(true);
    } else {
      toast.error("Something went wrong while saving");
    }
  };

  function checkImageHereOrNot(img) {
    if (img === undefined || img === "") {
      return false;
    } else {
      return true;
    }
  }

  function addMoreQuestionField(questionType) {
    expandCloseAll();

    let newQuestion = {
      questionType: questionType,
      questionText: "",
      options:
        questionType === "fileUpload" || questionType === "shortAnswer"
          ? []
          : [{ optionText: "Option 1" }],
      open: true,
    };

    setQuestions((questions) => [...questions, newQuestion]);
  }

  function copyQuestion(i) {
    let qs = [...questions];
    expandCloseAll();
    const myNewOptions = [];
    qs[i].options.forEach((opn) => {
      if (opn.optionImage !== undefined || opn.optionImage !== "") {
        var opn1new = {
          optionText: opn.optionText,
          optionImage: opn.optionImage,
        };
      } else {
        var opn1new = {
          optionText: opn.optionText,
        };
      }
      myNewOptions.push(opn1new);
    });
    const qImage = qs[i].questionImage || "";
    var newQuestion = {
      questionType: qs[i].questionType,
      questionText: qs[i].questionText,
      questionImage: qImage,
      options: myNewOptions,
      open: true,
    };
    setQuestions((questions) => [...questions, newQuestion]);
  }

  // const handleImagePopupOpen = () => {
  //     setOpenUploadImagePop(true);
  // };

  function uploadImage(i, j) {
    // setImageContextData({
    //     question: i,
    //     option: j
    // })
    // setOpenUploadImagePop(true)

    if (
      questions[i].questionType === "checkbox" ||
      questions[i].questionType === "multipleChoice"
    ) {
      setImageContextData({ question: i, option: j });
      setOpenUploadImagePop(true);
    } else if (j === null) {
      setImageContextData({ question: i, option: j });
      setOpenUploadImagePop(true);
    }
  }

  function updateImageLink(link, context) {
    var optionsOfQuestion = [...questions];
    var i = context.question;
    var imageName = "";

    if (context.option == null) {
      if (link === "") {
        imageName = optionsOfQuestion[i].questionImage;
      }

      optionsOfQuestion[i].questionImage = link;
    } else {
      var j = context.option;

      if (link === "") {
        imageName = optionsOfQuestion[i].options[j].optionImage;
      }

      optionsOfQuestion[i].options[j].optionImage = link;
    }

    if (imageName) {
      imageName = imageName.split("image/")[1];

      axios.delete(`/delete-image/${imageName}`);
    }
    setQuestions(optionsOfQuestion);
  }

  function deleteQuestion(i) {
    let qs = [...questions];

    updateImageLink("", { question: i, option: null });

    qs[i].options.forEach((option, j) => {
      updateImageLink("", { question: i, option: j });
    });

    qs.splice(i, 1);
    setQuestions(qs);
  }

  function handleOptionValue(text, i, j) {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[i].options[j].optionText = text;
    setQuestions(optionsOfQuestion);
  }

  function handleQuestionValue(text, i) {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[i].questionText = text;
    setQuestions(optionsOfQuestion);
  }

  function showAsQuestion(i) {
    let qs = [...questions];
    qs[i].open = false;
    setQuestions(qs);
  }

  function addOption(i) {
    var optionsOfQuestion = [...questions];
    if (optionsOfQuestion[i].options.length < 5) {
      optionsOfQuestion[i].options.push({
        optionText: "Option " + (optionsOfQuestion[i].options.length + 1),
      });
    } else {
      console.log("Max  5 options ");
    }
    //console.log(optionsOfQuestion)
    setQuestions(optionsOfQuestion);
  }

  function removeOption(i, j) {
    var optionsOfQuestion = [...questions];
    if (optionsOfQuestion[i].options.length > 1) {
      optionsOfQuestion[i].options.splice(j, 1);
      setQuestions(optionsOfQuestion);
      // console.log(i + "--" + j)
    }
  }

  function expandCloseAll() {
    let qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      qs[j].open = false;
    }
    setQuestions(qs);
  }

  function handleExpand(i) {
    let qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      if (i === j) {
        qs[i].open = true;
      } else {
        qs[j].open = false;
      }
    }
    setQuestions(qs);
  }

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    var itemgg = [...questions];

    const itemF = reorder(
      itemgg,
      result.source.index,
      result.destination.index
    );

    setQuestions(itemF);
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Function to render the draggable question items
  const questionsUI = () => {
    return questions.map((ques, i) => (
      <Draggable key={i} draggableId={i + "id"} index={i}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div>
              <div style={{ marginBottom: "15px" }}>
                <div style={{ width: "100%", marginBottom: "-7px" }}>
                  <DragIndicatorIcon
                    style={{
                      transform: "rotate(-90deg)",
                      color: "#DAE0E2",
                      marginBottom: "10px",
                    }}
                    fontSize="small"
                  />
                </div>

                <Accordion
                  onChange={() => {
                    handleExpand(i);
                  }}
                  expanded={questions[i].open}
                >
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    elevation={1}
                    style={{ width: "100%" }}
                  >
                    {!questions[i].open ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          marginLeft: "3px",
                          paddingTop: "15px",
                          paddingBottom: "15px",
                        }}
                      >
                        {/* <TextField id="standard-basic" label=" " value="Question" InputProps={{ disableUnderline: true }} />  */}

                        <Typography
                          variant="subtitle1"
                          style={{ marginLeft: "0px" }}
                        >
                          {i + 1}. {ques.questionText}
                        </Typography>

                        {ques.questionImage !== "" ? (
                          <div>
                            <img
                              src={ques.questionImage}
                              width="400px"
                              height="auto"
                            />
                            <br></br>
                            <br></br>
                          </div>
                        ) : (
                          ""
                        )}

                        {ques.questionType === "fileUpload" && (
                          <Button
                            variant="outlined"
                            disabled
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <UploadFileIcon style={{ marginRight: "5px" }} />
                            Add File
                          </Button>
                        )}

                        {ques.questionType === "shortAnswer" && (
                          <TextField
                            fullWidth={true}
                            disabled
                            placeholder="Short Answer"
                            style={{ marginTop: "10px" }}
                            InputProps={{
                              disableUnderline: true,
                              style: {
                                borderBottom: "1px solid #ccc",
                                borderRadius: 0,
                              },
                            }}
                            variant="standard"
                          />
                        )}

                        {ques.options.map((op, j) => (
                          <div key={j}>
                            <div style={{ display: "flex" }}>
                              {ques.questionType === "multipleChoice" && (
                                <FormControlLabel
                                  disabled
                                  control={
                                    <Radio style={{ marginRight: "3px" }} />
                                  }
                                  label={
                                    <Typography style={{ color: "#555555" }}>
                                      {ques.options[j].optionText}
                                    </Typography>
                                  }
                                />
                              )}
                              {ques.questionType === "checkbox" && (
                                <FormControlLabel
                                  disabled
                                  control={
                                    <Checkbox style={{ marginRight: "3px" }} />
                                  }
                                  label={
                                    <Typography style={{ color: "#555555" }}>
                                      {ques.options[j].optionText}
                                    </Typography>
                                  }
                                />
                              )}
                              {ques.questionType === "dropdown" && (
                                <FormControlLabel
                                  disabled
                                  control={
                                    <Typography
                                      style={{
                                        marginRight: "20px",
                                        marginLeft: "10px",
                                        marginTop: "10px",
                                      }}
                                    >
                                      {" "}
                                      {j + 1}.{" "}
                                    </Typography>
                                  }
                                  label={
                                    <Typography
                                      style={{
                                        color: "#555555",
                                        marginTop: "10px",
                                      }}
                                    >
                                      {ques.options[j].optionText}
                                    </Typography>
                                  }
                                />
                              )}
                            </div>

                            <div>
                              {op.optionImage !== "" ? (
                                <img
                                  src={op.optionImage}
                                  width="160px"
                                  height="auto"
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </AccordionSummary>

                  <AccordionDetails>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        marginLeft: "15px",
                        marginTop: "-15px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          style={{ marginTop: "20px", marginRight: "10px" }}
                        >
                          {i + 1}.
                        </Typography>
                        <TextField
                          fullWidth={true}
                          placeholder="Question Text"
                          style={{ marginBottom: "18px" }}
                          minRows={1}
                          hiddenLabel
                          multiline={true}
                          value={ques.questionText}
                          variant="filled"
                          onChange={(e) => {
                            handleQuestionValue(e.target.value, i);
                          }}
                        />
                        <Tooltip title="Upload Image" arrow>
                          <IconButton
                            aria-label="upload image"
                            onClick={() => {
                              uploadImage(i, null);
                            }}
                          >
                            <CropOriginalIcon />
                          </IconButton>
                        </Tooltip>
                      </div>

                      <div>
                        {checkImageHereOrNot(ques.questionImage) ? (
                          <div>
                            <div
                              style={{
                                width: "150px",
                                display: "flex",
                                alignItems: "flex-start",
                                paddingLeft: "20px",
                              }}
                            >
                              <img
                                src={ques.questionImage}
                                width="150px"
                                height="auto"
                              />
                              <Tooltip title="Delete Image" arrow>
                                <IconButton
                                  style={{
                                    marginLeft: "-15px",
                                    marginTop: "-15px",
                                    zIndex: 999,
                                    backgroundColor: "lightgrey",
                                    color: "grey",
                                  }}
                                  size="small"
                                  onClick={() => {
                                    updateImageLink("", {
                                      question: i,
                                      option: null,
                                    });
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div style={{ width: "100%" }}>
                        {ques.options.map((op, j) => (
                          <div key={j}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginLeft: "-12.5px",
                                justifyContent: "space-between",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }}
                            >
                              {ques.questionType === "multipleChoice" && (
                                <Radio disabled />
                              )}
                              {ques.questionType === "checkbox" && (
                                <Checkbox disabled />
                              )}
                              {ques.questionType === "dropdown" && (
                                <Typography
                                  style={{
                                    marginRight: "20px",
                                    marginLeft: "10px",
                                    marginTop: "20px",
                                  }}
                                >
                                  {" "}
                                  {j + 1}.{" "}
                                </Typography>
                              )}
                              <TextField
                                fullWidth={true}
                                placeholder="Option Text"
                                style={{ marginTop: "5px" }}
                                value={ques.options[j].optionText}
                                onChange={(e) => {
                                  handleOptionValue(e.target.value, i, j);
                                }}
                              />

                              {ques.questionType === "checkbox" ||
                              ques.questionType === "multipleChoice" ? (
                                <Tooltip title="Upload Image" arrow>
                                  <IconButton
                                    aria-label="upload image"
                                    onClick={() => {
                                      uploadImage(i, j);
                                    }}
                                  >
                                    <CropOriginalIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                ""
                              )}

                              {ques.options.length > 1 ? (
                                <Tooltip title="Remove Option" arrow>
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() => {
                                      updateImageLink("", {
                                        question: i,
                                        option: j,
                                      });
                                      removeOption(i, j);
                                    }}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                ""
                              )}
                            </div>

                            <div>
                              {checkImageHereOrNot(op.optionImage) &&
                              (ques.questionType === "checkbox" ||
                                ques.questionType === "multipleChoice") ? (
                                <div>
                                  <div
                                    style={{
                                      width: "150px",
                                      display: "flex",
                                      alignItems: "flex-start",
                                      paddingLeft: "20px",
                                    }}
                                  >
                                    <img
                                      src={op.optionImage}
                                      width="90px"
                                      height="auto"
                                    />
                                    <Tooltip title="Delete Image" arrow>
                                      <IconButton
                                        style={{
                                          marginLeft: "-15px",
                                          marginTop: "-15px",
                                          zIndex: 999,
                                          backgroundColor: "lightgrey",
                                          color: "grey",
                                        }}
                                        size="small"
                                        onClick={() => {
                                          updateImageLink("", {
                                            question: i,
                                            option: j,
                                          });
                                        }}
                                      >
                                        <CloseIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                  <br></br>
                                  <br></br>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {ques.questionType !== "fileUpload" &&
                      ques.questionType !== "shortAnswer" &&
                      ques.options.length < 5 ? (
                        <div>
                          {ques.questionType === "multipleChoice" && (
                            <FormControlLabel
                              disabled
                              control={<Radio />}
                              label={
                                <Button
                                  size="small"
                                  onClick={() => {
                                    addOption(i);
                                  }}
                                  style={{
                                    textTransform: "none",
                                    marginLeft: "-5px",
                                  }}
                                >
                                  Add Option
                                </Button>
                              }
                            />
                          )}

                          {ques.questionType === "checkbox" && (
                            <FormControlLabel
                              disabled
                              control={<Checkbox />}
                              label={
                                <Button
                                  size="small"
                                  onClick={() => {
                                    addOption(i);
                                  }}
                                  style={{
                                    textTransform: "none",
                                    marginLeft: "-5px",
                                  }}
                                >
                                  Add Option
                                </Button>
                              }
                            />
                          )}

                          {ques.questionType === "dropdown" && (
                            <FormControlLabel
                              disabled
                              control={
                                <Typography
                                  style={{
                                    marginRight: "20px",
                                    marginLeft: "10px",
                                  }}
                                >
                                  {" "}
                                  {questions[i].options.length + 1}.{" "}
                                </Typography>
                              }
                              label={
                                <Button
                                  size="small"
                                  onClick={() => {
                                    addOption(i);
                                  }}
                                  style={{
                                    textTransform: "none",
                                    marginLeft: "-5px",
                                  }}
                                >
                                  Add Option
                                </Button>
                              }
                            />
                          )}

                          <br></br>
                          <br></br>
                          <br></br>

                          <Typography variant="body2" style={{ color: "grey" }}>
                            You can add maximum 5 options.
                          </Typography>
                        </div>
                      ) : (
                        ""
                      )}

                      {ques.questionType === "fileUpload" && (
                        <Button
                          variant="outlined"
                          disabled
                          style={{
                            marginTop: "10px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <UploadFileIcon style={{ marginRight: "5px" }} />
                          Add File
                        </Button>
                      )}

                      {ques.questionType === "shortAnswer" && (
                        <TextField
                          fullWidth={true}
                          disabled
                          placeholder="Short Answer"
                          style={{ marginTop: "10px" }}
                          InputProps={{
                            disableUnderline: true,
                            style: {
                              borderBottom: "1px solid #ccc",
                              borderRadius: 0,
                            },
                          }}
                          variant="standard"
                        />
                      )}
                    </div>
                  </AccordionDetails>

                  <Divider />

                  <AccordionActions>
                    <Tooltip title="Hide Question" arrow>
                      <IconButton
                        aria-label="View"
                        onClick={() => {
                          showAsQuestion(i);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Copy Question" arrow>
                      <IconButton
                        aria-label="Copy"
                        onClick={() => {
                          copyQuestion(i);
                        }}
                      >
                        <FilterNoneIcon />
                      </IconButton>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem />

                    <Tooltip title="Delete Question" arrow>
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          deleteQuestion(i);
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Tooltip>

                    {/* <IconButton aria-label="Image">
                                            <MoreVertIcon />
                                        </IconButton> */}
                  </AccordionActions>
                </Accordion>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    ));
  };

  return (
    <div className="question-tab-container">
      <div className="sidebar" id="questionBank">
        <div className="draggable-container">
          <div
            className="draggable"
            draggable="false"
            id="multipleChoice"
            onClick={() => addMoreQuestionField("multipleChoice")}
          >
            Multiple Choice
          </div>
          <div
            className="draggable"
            draggable="false"
            id="checkbox"
            onClick={() => addMoreQuestionField("checkbox")}
          >
            Checkboxes
          </div>
          <div
            className="draggable"
            draggable="false"
            id="dropdown"
            onClick={() => addMoreQuestionField("dropdown")}
          >
            Dropdown
          </div>
          {/* <div className="draggable" draggable="false" id="fileUpload" onClick={() => addMoreQuestionField('fileUpload')}>File Upload</div> */}
          <div
            className="draggable"
            draggable="false"
            id="shortAnswer"
            onClick={() => addMoreQuestionField("shortAnswer")}
          >
            Short Answer
          </div>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={saveForm}
            style={{ margin: "15px" }}
            endIcon={<SaveIcon />}
          >
            Save Questions{" "}
          </Button>
        </div>
      </div>
      <div className="questionnaire" id="questionnaire">
        {/* Drag questions here to create your questionnaire. */}
        <div
          style={{
            marginTop: "15px",
            marginBottom: "7px",
            paddingBottom: "30px",
          }}
        >
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            {loadingFormData ? <CircularProgress /> : ""}
            <Grid item xs={12} sm={5} style={{ width: "100%" }}>
              <Grid
                style={{ borderTop: "10px solid #2709B0", borderRadius: 10 }}
              >
                <div>
                  <div>
                    <Paper elevation={2} style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          marginLeft: "15px",
                          paddingTop: "20px",
                          paddingBottom: "20px",
                        }}
                      >
                        <Typography
                          variant="h4"
                          style={{
                            fontFamily: "sans-serif Roboto",
                            marginBottom: "15px",
                          }}
                        >
                          {formData.name}
                        </Typography>
                        <Typography variant="h6">
                          {formData.description}
                        </Typography>
                      </div>
                    </Paper>
                  </div>
                </div>
              </Grid>

              <Grid style={{ paddingTop: "10px" }}>
                <div>
                  <ImageUpload
                    handleImagePopOpen={openUploadImagePop}
                    handleImagePopClose={() => {
                      setOpenUploadImagePop(false);
                    }}
                    updateImageLink={updateImageLink}
                    contextData={imageContextData}
                  />

                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {questionsUI()}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
