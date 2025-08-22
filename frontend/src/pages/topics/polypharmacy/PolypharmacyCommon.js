import * as React from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState, useEffect } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Navigation from "../../Navigation/navigation";
import Footer from "../../Footer/Footer";

import { PolypharmacyCommonBackendUpdate, submitData } from "./PolypharmacyCommonController";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Search from "../../Search/Search";
import { useNavigate } from "react-router-dom";
import "./PolypharmacyCommon.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.success.main,

    color: theme.palette.common.white,

    fontWeight: "bold",

    textDecorationLine: "underline",
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  // hide last border

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function PolypharmacyCommon() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/api/polypharmacycommon")

      .then((response) => {
        setData(response.data);

        //console.log(response.data[0]);
      })

      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = (searchTerm) => {
    navigate(`/search/${searchTerm}`);
  };

  const admin = localStorage.getItem("admin");

  //add drug components shifted to this page itself
  const listHeader = "COM_DDI_PYS";
  const [description, setDescription] = useState("");

  
  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

  //used to store value when an input is selected by user

  const store_value = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ listHeader, description });
    submitData(listHeader, description)
      .then((data) => {
        window.alert("Data was added Successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        window.alert("Failed to submit the data!");
      });
  };

  //calls update query when an input was selected and is not anymore (if the value actually changed)

  const update_value = (event) => {
    if (admin) {
      console.log(value);

      if (event.target.value !== value) {
        event.preventDefault();

        PolypharmacyCommonBackendUpdate(event.target.name, event.target.id, event.target.value)
          .then((data) => {
            alert(`Data successfully updated!\nNew Value: ${event.target.value}`);
          })
          .catch((error) => {
            console.error(error);

            alert("Failed to update!");
          });
      } else {
        console.log("value was not changed, not updating");
      }
    } else {
      alert("You must be an administrator to edit");
    }
  };

  const handleDelete = async (Description) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        console.log(Description);
        await axios.delete(process.env.REACT_APP_BACKEND_URL + "/api/PolypharmacyCommon/delete/" + Description);
        window.alert("Information Deleted Successfully !");
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (data.length > 0) {
    //Editable Fields

    if (admin) {
      return (
        <>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
          />
          <Navigation />

          <Search onSearch={handleSearch}></Search>

          <div id="polypharmacyCommon">
            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography id="topicHeader">
                Common DDIs with Psychotropics
              </Typography>
            </Box>

            <TableContainer component={Paper}>
              <Table aria-label="customized table" id="polypharmacyCommonTable">
                <TableBody>
                  {data.map((dataObj, index) => (
                    <StyledTableRow key={index}>
                  
                      <StyledTableCell align="left">
                        <input
                          style={{ minWidth: "700px" }}
                          id="`Description`"
                          name={dataObj.Description}
                          type="text"
                          onFocus={store_value}
                          onBlur={update_value}
                          defaultValue={dataObj[`Description`]}
                        />{" "}
                        <button
                          style={{ background: "none", border: "none", cursor: "pointer" }}
                          onClick={(e) => handleDelete(dataObj[`Description`])}
                        >
                          <span class="material-symbols-outlined">delete</span>
                        </button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="box-content" style={{ width: "600px" }}>
                <div className="form-header">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" className="title">
                      Add New Information to the page
                    </Typography>         
                  </Box>
                </div>

                <form onSubmit={handleSubmit}>
                  <Box>
                    <TextField
                      style={{ minWidth: "400px" }}
                      label="Description:"
                      variant="filled"
                      value={description}
                      onChange={handleDescription}
                      multiline
                      required
                    />
                  </Box>
                  <Box sx={{ display: "flex", marginBottom: 10 }}>
                    <Button
                      style={{ minWidth: "400px" }}
                      type="submit"
                      variant="contained"
                      className="submit-button"
                      color="primary"
                    >
                      Submit
                    </Button>
                  </Box>
                  
                </form>
              </div>
            </TableContainer>
          </div>

          <Footer />
        </>
      );
    }
    //Non Editable Fields
    else {
      return (
        <>
          <Navigation />
          <Search onSearch={handleSearch}></Search>

          <div id="polypharmacyCommon">
            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography id="topicHeader">
                Common DDIs with Psychotropics
              </Typography>
            </Box>

            <TableContainer component={Paper}>
              <Table aria-label="customized table" id="common-ddi">
                <TableBody>
                  {data.map((dataObj, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="left">{dataObj[`Description`]} </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
          </div>
          <Footer />
        </>
      );
    }
  }
}
