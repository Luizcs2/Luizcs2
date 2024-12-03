import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  MenuItem,
  Menu,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Container,
  CssBaseline,
  CircularProgress,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CardActions,
  Box,
  Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";

import { toast } from "react-hot-toast";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import Moment from "react-moment";
import FormScreenshot from "../assets/FormScreenshot.png";
import "./CSS/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useContext(UserContext);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      toast.error("Please Log in");
    }
    // console.log("Use effect is working")
  }, [user, loading]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const logoutUser = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/logout");

      if (data.error) {
        setUser(null);
        toast.error(data.error);
        navigate("/");
      } else if (data.message) {
        setUser(null);
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error("Logout Unsuccesful");
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const cancelAddForm = () => {
    handleClose();
    setFormTitle("");
    setFormDescription("");
  };

  const createForm = async (e) => {
    e.preventDefault();

    const formData = {
      name: formTitle,
      description: formDescription,
      createdBy: user.id,
    };

    try {
      if (formData.name !== "") {
        const { data } = await axios.post("/create-form", { formData });

        if (data.error) {
          toast.error(data.error);
          navigate("/dashboard");
        } else {
          toast.success(data.message);
          navigate(data.link);
        }
      } else {
        toast.error("Form Title cannot be empty");
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleHomeButton = () => {
    navigate("/");
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleClickOpen}>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <AddIcon />
        </IconButton>
        <p>Create</p>
      </MenuItem>
      <MenuItem onClick={logoutUser}>
        <IconButton aria-label="account of current user" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className="dashboard-container">
      <div className="grow">
        <AppBar position="fixed" style={{ backgroundColor: "#131313" }}>
          <Toolbar>
            <Tooltip title="Home" arrow>
              <IconButton
                edge="start"
                className="menuButton"
                color="inherit"
                aria-label="open drawer"
                onClick={handleHomeButton}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
            <Typography
              className="title"
              variant="h6"
              noWrap
              style={{ color: "#e91111", marginTop: "2px" }}
            >
              MUQuest
            </Typography>
            <div className="search">
              <div className="searchIcon">
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: "inputRoot",
                  input: "inputInput",
                }}
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grow" />
            <div className="sectionDesktop">
              <Tooltip title="Create Form" arrow>
                <IconButton
                  aria-label="Create new form"
                  color="inherit"
                  onClick={handleClickOpen}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout" arrow>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  color="inherit"
                  onClick={logoutUser}
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
            </div>
            <div className="sectionMobile">
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        <div>
          <div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Create Form</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Creating a new empty form, just add form name and description.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Form Name"
                  type="text"
                  fullWidth={false}
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                  }}
                />
                <br />
                <TextField
                  margin="dense"
                  id="description"
                  label="Form Description"
                  type="text"
                  fullWidth
                  value={formDescription}
                  onChange={(e) => {
                    setFormDescription(e.target.value);
                  }}
                />
                <br />
              </DialogContent>
              <DialogActions>
                <Button onClick={cancelAddForm} color="primary">
                  Cancel
                </Button>
                <Button onClick={createForm} color="primary">
                  Create
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <div style={{ marginTop: "10px" }}>
            {user && !loading && (
              <Forms userID={user.id} searchTerm={searchTerm} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Forms({ userID, searchTerm }) {
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      if (userID === undefined) {
        console.log("User ID is undefined");
      } else {
        try {
          const { data } = await axios.get(`/get-user-forms/${userID}`);

          if (data.error) {
            toast.error(data.error);
            setForms([]);
          } else {
            if (Array.isArray(data.forms)) {
              setForms(data.forms);
            }
          }
        } catch (error) {
          console.log("Error: " + error);
          setForms([]);
        } finally {
          setLoadingForms(false);
        }
      }
    };
    setTimeout(() => {
      fetchForms();
    }, 1000);
  }, [userID]);

  const handleDeleteForm = (formID) => {
    setForms(forms.filter((form) => form._id !== formID));
  };

  const filteredForms = forms.filter(
    (form) =>
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form-container">
      <CssBaseline />

      {loadingForms ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div style={{ display: "flex", height: "100%" }}>
          <Container className="cardGrid" maxWidth="lg">
            <Grid container spacing={6}>
              {filteredForms.length > 0 ? (
                filteredForms.map((form, i) => (
                  <OneForm
                    formData={form}
                    key={i}
                    onDelete={handleDeleteForm}
                  />
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "calc(100vh - 80px)",
                    marginLeft: "30px",
                  }}
                >
                  <Typography
                    variant="h4"
                    gutterBottom
                    style={{ color: "black" }}
                  >
                    No Forms Available
                  </Typography>
                </div>
              )}
            </Grid>
          </Container>
        </div>
      )}
    </div>
  );
}

function OneForm({ formData, onDelete }) {
  const [form, setForm] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");

  useEffect(() => {
    //console.log(formData)
    setForm(formData);
  }, [formData]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const { data } = await axios.delete(`/delete-form/${form._id}`);

      if (data.message) {
        toast.success(data.message);
        onDelete(form._id);
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.log("Deleting Form Error: " + error);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card className="root" style={{ backgroundColor: "#FAFAF9" }}>
        <CardActionArea href={`/questionnaire/${form._id}`}>
          <CardMedia
            className="media"
            image={FormScreenshot}
            component="img"
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {form.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {form.description}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Opened: <Moment fromNow>{form.updatedAt}</Moment>
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <Tooltip title="Delete Form" arrow>
              <IconButton aria-label="delete" onClick={handleDeleteClick}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
        {/* <CardActions>
                    <Button size="small" color="primary">
                        Share
                    </Button>
                    <Button size="small" color="primary">
                        Learn More
                    </Button>
                </CardActions> */}
      </Card>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this questionnaire?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
