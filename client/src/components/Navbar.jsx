import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(false);
    closeMenu();
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>Skillith</h1>

      <button className={styles.menuButton} onClick={toggleMenu}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </button>

      <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
        <Link to="/" className={styles.link} onClick={closeMenu}>
          Home
        </Link>
        <Link to="/matches" className={styles.link} onClick={closeMenu}>
          Matches
        </Link>

        {/* Conditional rendering for Login/Register and Account dropdown */}
        <div className={styles.dropdown}>
          <span className={styles.link} onClick={toggleDropdown}>
            {isLoggedIn ? "Account" : "Login / Register"}
          </span>
          {isDropdownOpen && (
            <div className={styles.dropdownContent}>
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className={styles.link} onClick={handleDropdownClick}>
                    Login
                  </Link>
                  <Link to="/register" className={styles.link} onClick={handleDropdownClick}>
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/update-account" className={styles.link} onClick={handleDropdownClick}>
                    Update Account
                  </Link>
                  <Link to="/delete-account" className={styles.link} onClick={handleDropdownClick}>
                    Delete Account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {isLoggedIn && (
          <span className={styles.link} onClick={handleLogout}>
            Logout
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
