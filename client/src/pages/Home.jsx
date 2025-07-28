import React from "react";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2>Exchange Skills and Learn Together!</h2> <br />
          <p>
            Find the right person to share your skills with and learn from
            others, anywhere, anytime.
          </p>
        </div>
      </section>

      <section id="about" className={styles.about}>
        <h3>What is SKILLITH?</h3>
        <p>
          Skillith is a platform designed to help people connect and exchange
          knowledge in various fields. Whether you're a beginner or an expert,
          Skillith allows you to find people with similar interests and share
          skills effectively.
        </p>
      </section>

      <section id="features" className={styles.features}>
        <h3>Features</h3>
        <div className={styles.featureItems}>
          <div className={styles.featureItem}>
            <h4>Skill Exchange</h4>
            <p>
              Connect with users who want to learn or teach specific skills.
            </p>
          </div>
          <div className={styles.featureItem}>
            <h4>Secure Messaging</h4>
            <p>
              Chat privately with your skill matches through a secure messaging
              system.
            </p>
          </div>
          <div className={styles.featureItem}>
            <h4>Personalized Matching</h4>
            <p>
              Get matched with users based on your skill preferences and
              learning goals.
            </p>
          </div>
        </div>
      </section>

      <footer id="contact" className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2025 Skillith. All rights reserved.</p>
          <ul className={styles.socialLinks}>
            <li>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Home;
