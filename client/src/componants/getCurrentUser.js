import axios from "axios";
const getCurrentUserUrl = "http://localhost:5000/isloggedin";

const getCurrentUser = async () => {
  try {
    const response = await axios.get(getCurrentUserUrl);
    return response.data.user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

module.exports = getCurrentUser;
