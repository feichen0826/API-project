import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (

  <nav className="navbar">
      <div className="navbar-logo">
        <NavLink exact to="/">
          MeetUs
        </NavLink>
      </div>

      <div className="navbar-auth">
        {sessionUser ? (
          <>
          <NavLink to="/create-group">Start a new group</NavLink>
          <div style={{ position: 'relative' }}>
            <ProfileButton user={sessionUser} />
          </div>

          </>
        ) : (
          <>
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
              tealBackground={true}
            />
          </>
        )}
      </div>
    </nav>
  );
}
export default Navigation;
