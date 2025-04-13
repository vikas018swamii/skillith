import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>Skillith</h1>

      {/* Hamburger Menu Button */}
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
        <Link to="/login" className={styles.link} onClick={closeMenu}>
          Login
        </Link>
        <Link to="/register" className={styles.link} onClick={closeMenu}>
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
