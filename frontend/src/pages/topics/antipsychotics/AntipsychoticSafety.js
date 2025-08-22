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
import AntipsychoticSafetyUpdate from "./AntipsychoticSafetyController";

import Navigation from "../../Navigation/navigation";
import Footer from "../../Footer/Footer";

import "./AntipsychoticSafety.css";
import { useNavigate } from "react-router-dom";
import Search from "../../Search/Search";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
    fontStyle: "italic",
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

export default function AntipsychoticSafety() {
  const [data, setData] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [newSafetyConcern, setNewSafetyConcern] = useState("");
  const [admin] = useState(localStorage.getItem("admin") === "true");
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = (searchTerm) => {
    navigate(`/search/${searchTerm}`);
  };

  const fetchData = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/api/AntipsychoticSafety")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addSafetyConcern = (description) => {
    if (admin) {
      axios
        .post(process.env.REACT_APP_BACKEND_URL + "/api/AntipsychoticSafety/add", { Description: description })
        .then((response) => {
          alert("Data successfully added! \nSafety Concern:" + description);
          fetchData();
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to add safety concern!");
        });
    } else {
      alert("You must be an administrator to add a safety concern");
    }
  };

  const handleDelete = async (Description) => {
    if (admin) {
      if (window.confirm("Are you sure you want to delete this record?")) {
        try {
          console.log(Description);
          await axios.delete(process.env.REACT_APP_BACKEND_URL + "/api/AntipsychoticsSafety/delete/" + Description);
          alert("Data deleted succesfully! \nSymptom:" + Description);
          window.location.reload();
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      alert("Must be an administrator to edit");
    }
  };

  const handleInputChange = (e) => {
    setNewSafetyConcern(e.target.value);
  };

  const store_value = (event) => {
    setValue(event.target.value);
  };

  const update_value = (event) => {
    if (admin) {
      console.log(value);
      if (event.target.value !== value) {
        event.preventDefault();
        AntipsychoticSafetyUpdate(event.target.name, event.target.id, event.target.value)
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

  
  if (data.length > 0) {
    if (admin) {
      return (
        <>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
          />
          <Navigation />
          <Search onSearch={handleSearch}></Search>
          <div id="antipsychoticSafety">
            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography id="topicHeader">Antipsychotics Safety Concerns</Typography>
            </Box>

            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableBody>
                  {data.map((dataObj, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>
                        <input
                          id="`Description`"
                          name={dataObj[`Description`]}
                          type="text"
                          onFocus={store_value}
                          onBlur={update_value}
                          defaultValue={dataObj[`Description`]}
                        />
                      </StyledTableCell>
                      <button
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "15px 2px" }}
                        onClick={(e) => handleDelete(dataObj.Description)}
                      >
                        <span class="material-symbols-outlined">delete</span>
                      </button>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Add a new Safety Concern */}
            {admin && (
              <div className="anti-button extra-margin">
                <button onClick={() => setFormVisible(!formVisible)} className="button-style">
                  {formVisible ? "Cancel" : "Add Safety Concern"}
                </button>
                {formVisible && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addSafetyConcern(newSafetyConcern);
                      setFormVisible(false);
                    }}
                    className="form-style"
                  >
                    <input
                      type="text"
                      name="Description"
                      placeholder="Description"
                      onChange={handleInputChange}
                      className="input-style"
                    />
                    <button type="submit" className="submit-button">
                      Submit
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
          <Footer />
        </>
      );
    } else {
      return (
        <>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
          />
          <Navigation />
          <Search onSearch={handleSearch}></Search>
          <div id="antipsychoticSafety">
            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography id="topicHeader">Antipsychotics Safety Concerns</Typography>
            </Box>

            <TableContainer component={Paper}>
              <Table aria-label="customized table" id="antipsychoticSafetyTable">
                <TableBody>
                  {data.map((dataObj, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{dataObj[`Description`]}</StyledTableCell>
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
