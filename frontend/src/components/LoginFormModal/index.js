import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="login-form-container">
     <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group3">
          <div className="password">Username or Email</div>
          <input
            type="text"
            id="credential"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        <div className="form-group3">
          <div className="password">Password</div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-password"
            required
          />
        </div>
        {errors.credential && (
          <p className="error-message">{errors.credential}</p>
        )}
        <button type="submit" className="submit-button">
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
