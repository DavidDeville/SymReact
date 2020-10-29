import React, { useContext, useState } from "react";
import Field from "../components/forms/Field";
import AuthContext from "../contexts/AuthContext";
import authAPI from "../services/authAPI";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  console.log(history);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  /**
   * Handle the form input changes
   *
   * @param {object} currentTarget - target of the form fields
   */
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;

    setCredentials({ ...credentials, [name]: value });
  };

  /**
   * Handle the API call to authenticate the user
   * Will set a token into the local storage if success, displays an error otherwise
   *
   * @param {object} event - event triggered on submit
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await authAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customers");
    } catch (error) {
      setError(
        "Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas"
      );
    }
  };

  return (
    <>
      <h1>Connexion à l'application</h1>

      <form onSubmit={handleSubmit}>
        <Field
          label="Adresse email"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Adresse email de connexion"
          error={error}
          type="email"
        />

        <Field
          label="Mot de passe"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          error={error}
          type="password"
        />
        
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
