// import React from "react";
// import { useDispatch } from "react-redux";
// import * as sessionActions from "../../store/session";
// import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";
// import './UserMenuDropdown.css'

// function UserMenuDropdown({ user, onClose }) {
//   const dispatch = useDispatch();

//   const logout = (e) => {
//     e.preventDefault();
//     dispatch(sessionActions.logout());
//     onClose(); // Close the menu after logging out
//   };

//   return (
//     <ul className="user-menu-dropdown">
//       <li>Hello, {user.username}</li>
//       <li>{user.email}</li>
//       <li>
//         <button onClick={logout}>Log Out</button>
//       </li>
//     </ul>
//   );
// }

// export default UserMenuDropdown;
