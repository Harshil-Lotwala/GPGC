import axios from "axios";

export const CognitiveEnhancersClinicalUpdate = async (column, oldValue, newValue) => {
  try {
    console.log("About to execute the query with:", { column, oldValue, newValue });
    const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/CognitiveEnhancersClinical/update", {
      column,
      oldValue,
      newValue,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const submitDrug = async (listHeader, description) => {
  try {
    const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/add/CognitiveEnhancersClinical", {
      listHeader,
      description,
    });
    console.log(response.data); // log response from server
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // throw error to be handled by calling function
  }
};
