import React, { useState } from "react";
import { FaGithub, FaLinkedin, FaBuilding } from "react-icons/fa";
import Header from "../../components/Header";
import "./index.css";

const About = () => {
  const [visibleSection, setVisibleSection] = useState("");

  const toggleSection = (section) => {
    setVisibleSection(visibleSection === section ? "" : section);
  };

  return (
    <>
      <Header />
      <div className="about-container">
        <div className="section-box">
          <button
            className={`about-heading ${
              visibleSection === "overview" ? "active" : ""
            }`}
            onClick={() => toggleSection("overview")}
          >
            Internship Assignment Overview
          </button>
          {visibleSection === "overview" && (
            <div className="about-section">
              <p>
                This project is an assignment given by Evoltsoft Technologies
                Pvt. Ltd. with the objective of building a full-stack
                application to manage electric vehicle charging stations.
              </p>
            </div>
          )}
        </div>

        <div className="section-box">
          <button
            className={`about-heading ${
              visibleSection === "features" ? "active" : ""
            }`}
            onClick={() => toggleSection("features")}
          >
            Features Implemented
          </button>
          {visibleSection === "features" && (
            <div className="about-section">
              <ul>
                <li>Full REST API using Node.js and Express</li>
                <li>CRUD operations for charging stations</li>
                <li>JWT-based user authentication</li>
                <li>React.js frontend with filters</li>
                <li>Interactive map view for station locations</li>
                <li>Cloud deployment of frontend and backend</li>
              </ul>
            </div>
          )}
        </div>

        <div className="section-box">
          <button
            className={`about-heading ${
              visibleSection === "techstack" ? "active" : ""
            }`}
            onClick={() => toggleSection("techstack")}
          >
            Tech Stack Used
          </button>
          {visibleSection === "techstack" && (
            <div className="about-section">
              <ul>
                <li>Backend: Node.js, Express, JWT</li>
                <li>Database: SQlite</li>
                <li>Frontend: React.js</li>
                <li>Map Integration: OpenStreetMap</li>
                <li>Deployment: Render, Vercel</li>
              </ul>
            </div>
          )}
        </div>

        <div className="section-box">
          <button
            className={`about-heading ${
              visibleSection === "instructions" ? "active" : ""
            }`}
            onClick={() => toggleSection("instructions")}
          >
            Submission Instructions
          </button>
          {visibleSection === "instructions" && (
            <div className="about-section">
              <p>
                The GitHub repository contains both backend and frontend code
                with setup instructions in the README file. The deployed
                frontend and API links are publicly accessible.
              </p>
            </div>
          )}
        </div>

        <div className="social-links">
          <a
            href="https://github.com/your-github-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
          >
            <FaGithub size={20} /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/amarnathracha"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
          >
            <FaLinkedin size={20} /> LinkedIn
          </a>
          <a
            href="https://evoltsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
          >
            <FaBuilding size={20} /> Evoltsoft Technologies Private Limited
          </a>
        </div>
      </div>
    </>
  );
};

export default About;
