import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./Nav"
import "./AboutPage.css";
import blur from "../assets/blur.png"; // ✅ Import image
import team1 from "../assets/team1.png";
import team2 from "../assets/team2.png";
import team3 from "../assets/team3.png";  
import b1 from "../assets/back1.png";
import b2 from "../assets/back2.png";
import b3 from "../assets/back3.png";
import b4 from "../assets/back4.png";
import b5 from "../assets/back5.png";
import b6 from "../assets/back6.png";
import b7 from "../assets/back7.png";
import b8 from "../assets/back8.png";
import b9 from "../assets/back9.png";
import b10 from "../assets/back10.png";

function AboutPage() {
  const [searchInput, setSearchInput] = useState("");
  const [showPopup] = useState(true);
  const [activeMember, setActiveMember] = useState(null);
  const navigate = useNavigate();
  const team = {
    ahana: {
      name: "Ahana Awasthi",
      role: "CEO",
      image: team1,
      description:
        "Ahana leads Shopora’s vision and overall strategy. She focuses on building a seamless e-commerce experience, product direction, and long-term brand growth.",
      responsibilities: [
        "Product vision and roadmap",
        "Business strategy and scaling",
        "User experience direction",
        "Brand identity and positioning",
      ],
    },

    wayza: {
      name: "Wayza Nigar",
      role: "Head of Product Curation",
      image: team2,
      description:
        "Wayza is responsible for selecting and organizing products that define Shopora’s catalog. She ensures quality, relevance, and trend alignment across all listings.",
      responsibilities: [
        "Product selection and sourcing",
        "Quality assurance of listings",
        "Trend analysis and forecasting",
        "Category management",
      ],
    },

    aditi: {
      name: "Aditi Sharma",
      role: "Customer Experience Lead",
      image: team3,
      description:
        "Aditi designs and improves the entire customer journey, ensuring users have a smooth, fast, and satisfying shopping experience across the platform.",
      responsibilities: [
        "Customer support experience",
        "UX feedback and improvements",
        "User journey optimization",
        "Issue resolution systems",
        "Retention and satisfaction",
      ],
    },
  };
 return (
   <>
     <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />

     {/* HERO SECTION */}
     <div
       className="about-vadilal-section d-flex justify-content-center align-items-center"
       style={{
         backgroundImage: `linear-gradient(rgba(51, 51, 51, 0.85), rgba(51, 51, 51, 0.85)), url(${blur})`,
       }}
     >
       <div className="about-oval text-center text-theme">
         <h1 className="about-heading">Welcome to Shopora</h1>
         <h2 className="about-subheading">Shop Smart. Live Better.</h2>

         <p className="about-paragraph">
           Shopora is your modern e-commerce destination for everyday
           essentials, lifestyle products, and trending finds. We focus on
           speed, simplicity, and a seamless shopping experience.
         </p>

         <p className="scroll-hint">Scroll to explore ↓</p>
       </div>
     </div>

     {/* IMAGE GRID */}
     <div className="d-flex parent overflow-hidden theme-grid">
       <div id="one" className="col">
         <img src={b1} className="heroimg" />
         <img src={b2} className="heroimg" />
       </div>

       <div id="two" className="col" style={{ marginLeft: 40 }}>
         <img src={b10} className="heroimg" />
         <img src={b3} className="heroimg" />
         <img src={b9} className="heroimg" />
       </div>

       <div id="three" className="col" style={{ marginLeft: 40 }}>
         <img src={b4} className="heroimg" />
         <img src={b7} className="heroimg" />
         <img src={b1} className="heroimg" />
       </div>

       <div id="four" className="col" style={{ marginLeft: 40 }}>
         <img src={b9} className="heroimg" />
         <img src={b6} className="heroimg" />
         <img src={b5} className="heroimg" />
       </div>

       <div id="five" className="col" style={{ marginLeft: 40 }}>
         <img src={b5} className="heroimg" />
         <img src={b8} className="heroimg" />
       </div>
     </div>

     {/* TAGLINE */}
     <div className="heading text-theme" style={{ marginTop: -100 }}>
       <h1>
         Fresh picks. <br />
         Fast delivery. <br /> Clean shopping.
       </h1>
     </div>

     {/* MISSION & VISION */}
     <section className="mission-section">
       <div className="container" style={{ height: 500 }}>
         <h2 className="section-title" style={{ fontSize: 40 }}>
           Our Mission & Vision
         </h2>

         <div className="mission-grid">
           <div className="mission-card">
             <h3>Mission</h3>
             <p>
               To make online shopping simple, fast, and enjoyable by offering
               quality products with a seamless experience. Shopora removes
               unnecessary complexity and improves discovery.
             </p>
           </div>

           <div className="mission-card">
             <h3>Vision</h3>
             <p>
               To build a modern e-commerce platform that feels intuitive,
               personal, and effortless for every user.
             </p>
           </div>
         </div>
       </div>
     </section>

     {/* TEAM */}
     <section className="team" id="team">
       <div className="container">
         <h2 className="section-title" style={{ fontSize: 40 }}>
           Meet Our Team
         </h2>

         <div className="team-grid">
           <div className="team-member">
             <img src={team1} />
             <h3>Ahana Awasthi</h3>
             <p>CEO</p>
             <button
               className="learn-more"
               onClick={() => setActiveMember("ahana")}
             >
               Learn More
             </button>
           </div>

           <div className="team-member">
             <img src={team2} />
             <h3>Wayza Nigar</h3>
             <p>Head of Product Curation</p>
             <button
               className="learn-more"
               onClick={() => setActiveMember("wayza")}
             >
               Learn More
             </button>
           </div>

           <div className="team-member">
             <img src={team3} />
             <h3>Aditi Singh</h3>
             <p>Customer Experience Lead</p>
             <button
               className="learn-more"
               onClick={() => setActiveMember("aditi")}
             >
               Learn More
             </button>
           </div>
         </div>
       </div>
     </section>

     {/* WHY SECTION */}
     <section className="why-us">
       <div className="container">
         <h2
           className="section-title"
           style={{ fontSize: 40, marginBottom: 70, marginTop: 0 }}
         >
           Why Choose Shopora?
         </h2>

         <ul className="why-list">
           <li>Fast & Smooth Shopping Experience</li>
           <li>Curated Quality Products</li>
           <li>User-Friendly Interface</li>
           <li>Secure & Reliable Platform</li>
         </ul>
       </div>
     </section>
     {activeMember && (
       <div className="modal-overlay" onClick={() => setActiveMember(null)}>
         <div className="modal-card" onClick={(e) => e.stopPropagation()}>
           {/* Header */}
           <div className="modal-header">
             <img
               src={team[activeMember].image}
               alt={team[activeMember].name}
               className="modal-avatar"
             />

             <div>
               <h2>{team[activeMember].name}</h2>
               <p className="modal-role">{team[activeMember].role}</p>
             </div>

             <button
               className="close-btn"
               onClick={() => setActiveMember(null)}
             >
               ✕
             </button>
           </div>

           {/* Body */}
           <div className="modal-body">
             <p className="modal-desc">{team[activeMember].description}</p>

             <h4>Key Responsibilities</h4>
             <ul>
               {team[activeMember].responsibilities.map((item, i) => (
                 <li key={i}>{item}</li>
               ))}
             </ul>
           </div>
         </div>
       </div>
     )}
   </>
 );
}

export default AboutPage;
