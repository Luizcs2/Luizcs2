import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Badge,
  Tooltip,
} from "@mui/material";

import MoreIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaletteIcon from "@mui/icons-material/Palette";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import CloseIcon from "@mui/icons-material/Close";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ViewListIcon from "@mui/icons-material/ViewList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./CSS/CreateQuestionnaire.css";

import QuestionTab from "./QuestionTab";
import ResponseTab from "./ResponseTab";

export default function CreateQuestionnaire() {
  const navigate = useNavigate();
  const { formID } = useParams();
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [formDetails, setFormDetails] = useState({});
  const [openOfAlert, setOpenOfAlert] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [formSaved, setFormSaved] = useState(false);

  const clipToClipboard = () => {
    navigator.clipboard.writeText(
      window.location.origin + "/view/" + formDetails._id
    );
    handleClickOfAlert();
    handleClose();
  };

  const handleClickOfAlert = () => {
    setOpenOfAlert(true);
  };

  const handleCloseOfAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenOfAlert(false);
  };

  function sendForm() {
    handleClickOpen();
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBack = () => {
    if (!formSaved) {
      return toast.error("Please save the form");
    }
    navigate("/dashboard");
  };

  const handleFormSaved = (savedStatus) => {
    if (savedStatus) {
      setFormSaved(true);
    }
  };

  useEffect(() => {
    const verifyFormID = async () => {
      try {
        const { data } = await axios.get(`/questionnaire/${formID}`);

        if (data.loginError) {
          setTimeout(() => {
            toast.error(data.loginError);
          }, 3000);
          navigate("/login");
        } else if (data.error) {
          setTimeout(() => {
            toast.error(data.error);
          }, 3000);
          navigate("/dashboard");
        } else {
          setFormDetails(data.formDetails);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getResponsesCount = async () => {
      try {
        const { data } = await axios.get(`/get-response-count/${formID}`);

        if (data.responseCount) {
          setResponseCount(data.responseCount);
        }
      } catch (error) {
        console.log(error);
      }
    };

    verifyFormID();
    getResponsesCount();

    const interval = setInterval(() => {
      getResponsesCount();
    }, 3000);

    return () => clearInterval(interval);
  }, [formID]);

  return (
    <div className="create-questionnaire-container">
      <div className="root">
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "white" }}
          elevation={2}
        >
          <Toolbar className="toolbar">
            <IconButton onClick={handleBack} sx={{ color: "#140078" }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              sx={{ marginLeft: "10px", marginTop: "4px", color: "black" }}
            >
              {formDetails.name}
            </Typography>
            {/* <IconButton aria-label="Rohit Saini's form">
                                <StarBorderIcon />
                            </IconButton> */}
            <Tabs
              className="title"
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Questions" />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Responses
                    <Badge badgeContent={responseCount} color="primary">
                      <span style={{ width: 15, height: 2 }} />
                    </Badge>
                  </Box>
                }
              />
            </Tabs>
            <Tooltip title="Send Form">
              <IconButton aria-label="send form" onClick={sendForm}>
                <SendIcon />
              </IconButton>
            </Tooltip>
            {/* <IconButton aria-label="palette">
                                <PaletteIcon />
                            </IconButton>
                            <IconButton aria-label="visibility">
                                <VisibilityIcon />
                            </IconButton>
                            <IconButton aria-label="settings">
                                <SettingsIcon />
                            </IconButton>
                            <IconButton aria-label="more actions" edge="end">
                                <MoreIcon />
                            </IconButton>
                        <IconButton aria-label="account circle" edge="end">
                            <AccountCircleIcon />
                        </IconButton> */}
          </Toolbar>
        </AppBar>
      </div>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Copy and Share Link"}
          </DialogTitle>
          <DialogContent>
            <Paper className="paper">
              <Grid container alignContent="space-between" alignItems="center">
                <Grid item>
                  <Typography variant="body1">
                    {window.location.origin + "/view/" + formDetails._id}
                  </Typography>
                </Grid>
                <Grid item>
                  <Tooltip title="Copy">
                    <IconButton
                      aria-label="Add"
                      size="medium"
                      onClick={clipToClipboard}
                    >
                      <FilterNoneIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Paper>
            <DialogContentText id="alert-dialog-description"></DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={openOfAlert}
          autoHideDuration={3000}
          onClose={handleCloseOfAlert}
          message="Copied to clipboard"
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseOfAlert}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
      <div>
        <TabPanel value={value} index={0}>
          <QuestionTab formData={formDetails} onFormSaved={handleFormSaved} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ResponseTab formData={formDetails} formID={formID} />
        </TabPanel>
      </div>
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
