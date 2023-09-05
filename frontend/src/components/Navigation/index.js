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

  // let sessionLinks;
  // if (sessionUser) {
  //   sessionLinks = (
  //     <li>
  //       <ProfileButton user={sessionUser} />
  //     </li>
  //   );
  // } else {
  //   sessionLinks = (
  //     <li>
  //       <OpenModalButton
  //         buttonText="Log In"
  //         modalComponent={<LoginFormModal />}
  //       />
  //       <OpenModalButton
  //         buttonText="Sign Up"
  //         modalComponent={<SignupFormModal />}
  //       />
  //     </li>
  //   );
  // }

  return (
  //   <ul >
  //       <li>
  //       <NavLink exact to="/">
  //         Home
  //       </NavLink>
  //       </li>
  //       {isLoaded && (
  //       <li>
  //         <ProfileButton user={sessionUser} />
  //       </li>
  //     )}
  //       {/* <NavLink to="/view-groups">
  //         See all groups
  //       </NavLink> */}

  //       {/* <NavLink to="/view-events">
  //         Find an event
  //       </NavLink> */}

  //       <NavLink to="/create-group">
  //         Start a new group
  //       </NavLink>

  //   </ul>
  // );
  <nav className="navbar">
      <div className="navbar-logo">
        <NavLink exact to="/">
          MeetUs
        </NavLink>
      </div>
      <ul className="navbar-nav">

        {/* {isLoaded && sessionUser && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )} */}

      </ul>
      <div className="navbar-auth">
        {sessionUser ? (
          <>
            <ProfileButton user={sessionUser} />
            <NavLink to="/create-group">Start a new group</NavLink>
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
