// import { Link } from "react-router-dom"

// export default function Navbar() {
//   return (
//     <nav>
//         <Link to='/'>Home</Link>
//         <Link to='/register'>Register</Link>
//         <Link to='/login'>Login</Link>
//     </nav>
//   )
// }

// navbar/Navbar.jsx

import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/" className="navbar-brand">
            Home
          </Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
}
