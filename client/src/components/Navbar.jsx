import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../assets/logo.png";
import hamburger from "../assets/hamburger.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(false);
    closeMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="Skillith Logo" className={styles.logoImage} />
        <h1 className={styles.logoText}>Skillith</h1>
      </Link>

      <button className={styles.menuButton} onClick={toggleMenu}>
        <img src={hamburger} alt="Menu" className={styles.menuIcon} />
      </button>

      <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
        <Link to="/" className={styles.link} onClick={closeMenu}>
          Home
        </Link>

        <Link to="/matches" className={styles.link} onClick={closeMenu}>
          Matches
        </Link>

        <div className={styles.dropdown} ref={dropdownRef}>
          <span className={styles.link} onClick={toggleDropdown}>
            {isLoggedIn ? (
              <span>
                Account &nbsp;
                <i className="fas fa-user"></i>
              </span>
            ) : (
              <span>
                Login / Register &nbsp;
                <i className="fas fa-sign-in-alt"></i>
              </span>
            )}
          </span>

          {isDropdownOpen && (
            <div className={styles.dropdown}>
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className={styles.link}
                    onClick={handleDropdownClick}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={styles.link}
                    onClick={handleDropdownClick}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/update-account"
                    className={styles.link}
                    onClick={handleDropdownClick}
                  >
                    Update Account
                  </Link>
                  <Link
                    to="/delete-account"
                    className={styles.link}
                    onClick={handleDropdownClick}
                  >
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
