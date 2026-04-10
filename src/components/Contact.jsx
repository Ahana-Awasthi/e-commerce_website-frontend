import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  ChatBubbleOutline,
  Phone,
  ShoppingCart,
  Replay,
  Payment,
  HelpOutline,
  PersonOutline,
  LocalOffer,
} from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NavBar from "./Nav";
import "./Contact.css";

const ContactUs = () => {
  const navigate = useNavigate(); // <--- move inside component
  const [expanded, setExpanded] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  // FAQ data
  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        "You can track your order from the 'My Orders' section in your account.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 7 days of delivery. Items must be unused and in original packaging.",
    },
    {
      question: "What if my payment fails?",
      answer:
        "If payment fails, please retry or contact your bank. Any deducted amount will be auto-refunded.",
    },
    {
      question: "Do you offer Cash on Delivery?",
      answer: "Yes, we offer COD in select regions.",
    },
    {
      question: "Is there a warranty on products?",
      answer:
        "Yes, we offer a warranty on select products. Please check the product details for more information.",
    },
    {
      question:
        "I want to change the address for delivery of my order. Is it possible now?",
      answer:
        "If your order has not yet been shipped, you can change the delivery address from the 'My Orders' section.",
    },
    {
      question:
        "How can I modify/add an alternate number for the order delivery?",
      answer:
        "You can add or modify an alternate number for delivery in the 'My Orders' section.",
    },
  ];

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />
    
      <div className="contact-page">
        <Container fluid>
          <Row>
            {/* Left: Browse Topics */}
            <Col md={8} className="topics-section">
              <h2 className="mt-2 mb-5">Browse Topics</h2>
              <div className="card-grid2">
                <div className="topic-card">
                  <ShoppingCart className="card-icon" />
                  <p>Order Related</p>
                </div>
                <div className="topic-card">
                  <Replay className="card-icon" />
                  <p>Returns & Refunds</p>
                </div>
                <div className="topic-card">
                  <Payment className="card-icon" />
                  <p>Payments & Billing</p>
                </div>
                <div className="topic-card">
                  <HelpOutline className="card-icon" />
                  <p>Product Queries</p>
                </div>
                <div className="topic-card">
                  <PersonOutline className="card-icon" />
                  <p>Account & Login</p>
                </div>
                <div className="topic-card">
                  <LocalOffer className="card-icon" />
                  <p>Offers & Coupons</p>
                </div>
              </div>
            </Col>

            {/* Right: FAQs */}
            <Col md={4} className="faq-section">
              <h2>Frequently Asked Questions</h2>
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  expanded={expanded === index}
                  onChange={handleChange(index)}
                  className="faq-accordion"
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    {faq.question}
                  </AccordionSummary>
                  <AccordionDetails>{faq.answer}</AccordionDetails>
                </Accordion>
              ))}
            </Col>
          </Row>
        </Container>

        {/* Floating Buttons */}
        <div className="floating-buttons">
          <button className="floating-btn" onClick={() => navigate("/Chatbot")}>
            <ChatBubbleOutline />
            <span className="float-info">Chat with us</span>
          </button>
          <button className="floating-btn" onClick={() => navigate("/Chatbot")}>
            <Phone />
            <span className="float-info">Call Support</span>
          </button>
        </div>

        {/* Footer */}
        <footer className="contact-footer">
          <div className="social-icons">
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-linkedin"></i>
            <i className="fa-brands fa-youtube"></i>
          </div>
          <span className="footer-text">
            support@yourecommerce.com | Mon–Sat, 9AM–9PM
          </span>
        </footer>
      </div>
    </>
  );
};

export default ContactUs;
