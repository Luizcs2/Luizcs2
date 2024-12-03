import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  FormControlLabel,
  Radio,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  RadioGroup,
  Divider,
  Container,
  Checkbox,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function UserView() {
  const navigate = useNavigate();
  const { formID } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [userID, setUserID] = useState("");
  const [formData, setFormData] = useState({});
  const [responseData, setResponseData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    const anonymousUserID =
      "Anonymous-" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    // console.log(anonymousUserID)
    setUserID(anonymousUserID);
  }, []);

  // useEffect(() => {
  //     console.log("Updated Data:\n\n" + JSON.stringify(responseData));
  // }, [responseData])

  useEffect(() => {
    const verifyFormID = async () => {
      try {
        const { data } = await axios.get(`/verify-view-form/${formID}`);

        if (data.error) {
          setErrorMessage(data.error);
          // toast.error(data.error)
        } else {
          setFormData(data.formDetails);
          setQuestions(data.formDetails.questions);

          // setTimeout(() => {
          //     console.log("Fetched Questions:\n\n" + JSON.stringify(questions))
          // }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    };
    verifyFormID();
  }, [formID]);

  const handleRadioChange = (
    questionID,
    optionID,
    optionValue,
    questionType
  ) => {
    const prevSelectedValues = selectedValues.filter(
      (value) => value.questionID !== questionID
    );
    prevSelectedValues.push({ questionID, optionValue });
    setSelectedValues(prevSelectedValues);

    const newResponseData = responseData.filter(
      (response) => response.questionID !== questionID
    );
    newResponseData.push({ questionID, questionType, answer: optionID });
    setResponseData(newResponseData);
  };

  const handleCheckboxChange = (questionID, optionID, questionType) => {
    const existingResponse = responseData.find(
      (response) => response.questionID === questionID
    );
    if (existingResponse) {
      const updatedOptions = existingResponse.answer || [];
      if (updatedOptions.includes(optionID)) {
        setResponseData(
          responseData.map((response) =>
            response.questionID === questionID
              ? {
                  ...response,
                  answer: updatedOptions.filter((id) => id !== optionID),
                }
              : response
          )
        );
      } else {
        setResponseData(
          responseData.map((response) =>
            response.questionID === questionID
              ? { ...response, answer: [...(updatedOptions || []), optionID] }
              : response
          )
        );
      }
    } else {
      setResponseData([
        ...responseData,
        { questionID, questionType, answer: [optionID] },
      ]);
    }
  };

  const handleDropdownChange = (
    questionID,
    optionID,
    optionValue,
    questionType
  ) => {
    const prevSelectedValues = selectedValues.filter(
      (value) => value.questionID !== questionID
    );
    prevSelectedValues.push({ questionID, optionValue });
    setSelectedValues(prevSelectedValues);

    // console.log("Selected Value Array: " + JSON.stringify(prevSelectedValues))

    const newResponseData = responseData.filter(
      (response) => response.questionID !== questionID
    );
    newResponseData.push({ questionID, questionType, answer: optionID });
    setResponseData(newResponseData);
  };

  const handleShortAnswerChange = (questionID, answerText, questionType) => {
    const newResponseData = responseData.filter(
      (response) => response.questionID !== questionID
    );
    newResponseData.push({ questionID, questionType, answer: answerText });
    setResponseData(newResponseData);
  };

  async function submitResponse() {
    var submissionData = {
      formID: formData._id,
      userID: userID,
      response: responseData,
    };
    console.log(submissionData);

    const { data } = await axios.post("/submit-response", { submissionData });

    if (data.message) {
      setIsSubmitted(true);
    } else if (data.error) {
      toast.error(data.error);
    }
  }

  function reloadForAnotherResponse() {
    window.location.reload(true);
  }

  return (
    <div style={{ height: "100vh" }}>
      {errorMessage ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            textAlign: "center",
            transform: "translateY(500%)",
          }}
        >
          <h1>{errorMessage}</h1>
        </div>
      ) : (
        <div>
          <AppBar position="fixed" style={{ backgroundColor: "black" }}>
            <Toolbar>
              <Typography variant="h6" style={{ color: "#e91111" }}>
                MUQuest
              </Typography>
            </Toolbar>
          </AppBar>
          <br></br>

          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ marginTop: "70px" }}
          >
            <Grid item xs={12} sm={5} style={{ width: "70%" }}>
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
                        {isSubmitted && (
                          <div style={{ marginTop: "20px" }}>
                            <Typography variant="subtitle1">
                              Thanks for submitting the form.
                            </Typography>
                            <Button
                              onClick={reloadForAnotherResponse}
                              style={{ marginTop: "20px", padding: "5px" }}
                            >
                              Submit another response
                            </Button>
                          </div>
                        )}
                      </div>
                    </Paper>
                  </div>
                </div>
              </Grid>

              {!isSubmitted && (
                <div>
                  <Grid>
                    {questions.map((ques, i) => (
                      <div key={i}>
                        <br></br>
                        <Paper>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginLeft: "20px",
                                marginRight: "20px",
                                paddingTop: "15px",
                                paddingBottom: "15px",
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                style={{ marginLeft: "0px" }}
                              >
                                {i + 1}. {ques.questionText}
                              </Typography>

                              {ques.questionImage && (
                                <div>
                                  <img
                                    src={ques.questionImage}
                                    width="80%"
                                    height="auto"
                                  />
                                  <br></br>
                                  <br></br>
                                </div>
                              )}

                              {ques.questionType === "multipleChoice" && (
                                <RadioGroup
                                  aria-label="quiz"
                                  name="quiz"
                                  value={
                                    selectedValues.find(
                                      (value) => value.questionID === ques._id
                                    )?.optionValue ?? ""
                                  }
                                  onChange={(e) =>
                                    handleRadioChange(
                                      ques._id,
                                      ques.options[e.target.value]._id,
                                      e.target.value,
                                      ques.questionType
                                    )
                                  }
                                >
                                  {ques.options.map((op, j) => (
                                    <div key={j}>
                                      <FormControlLabel
                                        value={j}
                                        control={<Radio />}
                                        label={op.optionText}
                                      />
                                      {op.optionImage && (
                                        <div
                                          style={{
                                            display: "flex",
                                            marginLeft: "10px",
                                          }}
                                        >
                                          <img
                                            src={op.optionImage}
                                            width="64%"
                                            height="auto"
                                          />
                                          <Divider />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </RadioGroup>
                              )}

                              {ques.questionType === "checkbox" && (
                                <div>
                                  {ques.options.map((op, j) => (
                                    <div key={j}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            onChange={() =>
                                              handleCheckboxChange(
                                                ques._id,
                                                op._id,
                                                ques.questionType
                                              )
                                            }
                                          />
                                        }
                                        label={op.optionText}
                                      />
                                      {op.optionImage && (
                                        <div
                                          style={{
                                            display: "flex",
                                            marginLeft: "10px",
                                          }}
                                        >
                                          <img
                                            src={op.optionImage}
                                            width="64%"
                                            height="auto"
                                          />
                                          <Divider />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {ques.questionType === "dropdown" && (
                                <div>
                                  <Select
                                    value={
                                      selectedValues.find(
                                        (value) => value.questionID === ques._id
                                      )?.optionValue ?? ""
                                    }
                                    onChange={(e) =>
                                      handleDropdownChange(
                                        ques._id,
                                        ques.options[e.target.value]._id,
                                        e.target.value,
                                        ques.questionType
                                      )
                                    }
                                    fullWidth
                                    displayEmpty
                                    style={{ marginTop: "10px" }}
                                  >
                                    <MenuItem value="" disabled>
                                      Choose Option...
                                    </MenuItem>
                                    {ques.options.map((op, j) => (
                                      <MenuItem key={j} value={j}>
                                        {op.optionText}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </div>
                              )}

                              {ques.questionType === "shortAnswer" && (
                                <TextField
                                  fullWidth
                                  multiline
                                  minRows={1}
                                  placeholder="Your answer"
                                  onChange={(e) =>
                                    handleShortAnswerChange(
                                      ques._id,
                                      e.target.value,
                                      ques.questionType
                                    )
                                  }
                                  style={{
                                    marginTop: "10px",
                                    marginRight: "10px",
                                  }}
                                  InputProps={{
                                    style: {
                                      borderBottom: "1px solid",
                                      borderRadius: 0,
                                    },
                                  }}
                                  variant="standard"
                                />
                              )}
                            </div>
                          </div>
                        </Paper>
                      </div>
                    ))}
                  </Grid>
                  <Grid>
                    <br></br>
                    <div style={{ display: "flex" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={submitResponse}
                      >
                        Submit
                      </Button>
                    </div>
                    <br></br>
                  </Grid>
                </div>
              )}
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}
