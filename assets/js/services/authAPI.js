import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 *  Remove the token from local storage and delete axios default header
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

/**
 * HTTP request to login. Sets the token into local storage and axios header (Bearer)
 * 
 * @param {objet} credentials 
 */
function authenticate(credentials) {
  return axios
    .post("http://localhost:8000/api/login_check", credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // Puts the token into the localstorage
      window.localStorage.setItem("authToken", token);

      // Tells axios that we have a default header from now on
      setAxiosToken(token);
    });
}

/**
 * Sets the JWT Token into axios
 * 
 * @param {string} token 
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Handle the JWT on application boot
 */
function setup() {
  /**
   * Grab the token if it exists
   */
  const token = window.localStorage.getItem("authToken");

  /**
   * Checks if there's actually a token. If that's the case, checks
   * if the expiration date is still superior to the current date
   * and sets the token into axios header
   */
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Checks if the user is logged in or not
 * 
 * @returns {bool}
 */
function isAuthenticated() {
  const token = window.localStorage.getItem("authToken");

  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
};
