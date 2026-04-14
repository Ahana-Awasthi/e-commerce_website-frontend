import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./Nav";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("intro");
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});
  const handleGeneratePDF = async () => {
    try {
      const element = document.querySelector(".privacy-policy"); // capture the whole page
      if (!element) return;

      // Make sure the element is fully rendered
      const canvas = await html2canvas(element, {
        scale: 2, // higher = better quality
        useCORS: true,
        scrollY: -window.scrollY, // capture full view correctly
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = canvas;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add extra pages if content is taller than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("PrivacyPolicy.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert(
        "Failed to generate PDF. Make sure html2canvas & jspdf are installed.",
      );
    }
  };
  const sections = [
    { id: "intro", title: "Introduction", icon: "fa-info-circle" },
    { id: "info", title: "Information We Collect", icon: "fa-user" },
    { id: "use", title: "How We Use It", icon: "fa-cogs" },
    { id: "share", title: "Information Sharing", icon: "fa-share-alt" },
    { id: "cookies", title: "Cookies & Tracking", icon: "fa-cookie-bite" },
    { id: "security", title: "Security", icon: "fa-shield-alt" },
    { id: "rights", title: "Your Rights", icon: "fa-balance-scale" },
    { id: "contact", title: "Contact Us", icon: "fa-envelope" },
  ];
  const [searchInput, setSearchInput] = useState("");

  const scrollToSection = useCallback((sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  }, []);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.1,
      },
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 },
    );

    sections.forEach((section) => {
      const element = sectionRefs.current[section.id];
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />

      <div className="privacy-policy">
        <Header onBack={handleBack} />

        <main className="main-content">
          <div className="container">
            <TableOfContents
              sections={sections}
              activeSection={activeSection}
              onNavigate={scrollToSection}
            />

            <div className="policy-card">
              <PolicyHeader />

              {sections.map((section) => (
                <PolicySection
                  key={section.id}
                  ref={(el) => (sectionRefs.current[section.id] = el)}
                  id={section.id}
                  title={section.title}
                  icon={section.icon}
                  isVisible={isVisible[section.id]}
                  content={getSectionContent(section.id)}
                />
              ))}
            </div>

            <ActionButtons onPrint={handlePrint} navigate={ navigate } />
          </div>
        </main>
      </div>
    </>
  );
};

const Header = ({ onBack }) => (
  <header className="header">
    <div className="container">
      <nav className="nav">
        <a href="/" className="logo">
          <i className="fas fa-shopping-bag"></i>
          <span>Shopora</span>
        </a>
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          Back to Shopping
        </button>
      </nav>
    </div>
  </header>
);

const TableOfContents = ({ sections, activeSection, onNavigate }) => (
  <div className="toc">
    <h3 className="toc-title">
      <i className="fas fa-list-ul"></i> Quick Navigation
    </h3>
    <div className="toc-list">
      {sections.map((section) => (
        <div
          key={section.id}
          className={`toc-item ${activeSection === section.id ? "active" : ""}`}
          onClick={() => onNavigate(section.id)}
        >
          {section.title}
        </div>
      ))}
    </div>
  </div>
);

const PolicyHeader = () => (
  <div className="policy-header">
    <h1 className="policy-title">Privacy Policy</h1>
    <p className="policy-subtitle">Last updated: December 15, 2024</p>
    <div className="policy-badge">
      <i className="fas fa-shield-alt"></i>
      Your privacy is our priority
    </div>
  </div>
);

const PolicySection = React.forwardRef(
  ({ id, title, icon, isVisible, content }, ref) => (
    <div
      ref={ref}
      id={id}
      className={`policy-section ${isVisible ? "visible" : ""}`}
    >
      <h2 className="section-title">
        <i className={`fas ${icon}`}></i>
        {title}
      </h2>
      <div
        className="section-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  ),
);

const ActionButtons = ({ navigate }) => (
  <div className="action-buttons">
    <button
      className="btn btn-primary"
      onClick={() => {
        navigate("/Redirect");
      }}
    >
      <i className="fas fa-shop" style={{ marginRight: 10 }}></i>
      Continue Shopping
    </button>
    <a
      href="https://mail.google.com/mail/u/0/?to=shopora@gmail.com&su=Request+for+Clarification+regarding+Privacy+Policy&body=Dear+Support+Team,%0A%0AI+am+contacting+you+regarding+some+questions+about+my+privacy+and+rights.++I+want+clarify+the+following+points:+%0A+++-++%0A+++-++%0A+++-++%0A%0A%0ARegards,%0A&fs=1&tf=cm"
      target="_blank"
      className="btn btn-secondary"
    >
      <i className="fas fa-envelope" style={{ marginRight: 10 }}></i>
      Contact Privacy Team
    </a>
  </div>
);

const getSectionContent = (sectionId) => {
  const content = {
    intro: `
      <p>At Shopora, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our e-commerce platform.</p>
      <p>We process personal information in accordance with applicable data protection laws including GDPR, CCPA, and other relevant regulations.</p>
    `,
    info: `
      <ul class="section-list">
        <li><strong>Personal Information:</strong> Name, email, phone number, shipping/billing address</li>
        <li><strong>Payment Information:</strong> Credit card details (processed securely via PCI-compliant gateways)</li>
        <li><strong>Account Information:</strong> Username, password, purchase history</li>
        <li><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent</li>
        <li><strong>Cookies:</strong> Session cookies, analytics cookies, marketing cookies</li>
      </ul>
    `,
    use: `
      <ul class="section-list">
        <li>Process and fulfill your orders</li>
        <li>Provide customer support</li>
        <li>Send order confirmations and updates</li>
        <li>Personalize your shopping experience</li>
        <li>Improve our website and services</li>
        <li>Send promotional offers (with your consent)</li>
        <li>Prevent fraud and ensure security</li>
      </ul>
    `,
    share: `
      <p>We do not sell your personal information. We may share data with:</p>
      <ul class="section-list">
        <li>Shipping carriers for delivery</li>
        <li>Payment processors for transactions</li>
        <li>Service providers (analytics, marketing)</li>
        <li>Law enforcement (when required by law)</li>
      </ul>
    `,
    cookies: `
      <p>We use cookies to enhance your experience. You can manage cookie preferences through your browser settings.</p>
      <ul class="section-list">
        <li><strong>Essential Cookies:</strong> Required for site functionality</li>
        <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
        <li><strong>Marketing Cookies:</strong> Personalize ads and promotions</li>
      </ul>
    `,
    security: `
      <p>We implement industry-standard security measures including:</p>
      <ul class="section-list">
        <li>SSL/TLS encryption for all data transmission</li>
        <li>Regular security audits and penetration testing</li>
        <li>Secure payment processing (PCI DSS compliant)</li>
        <li>Two-factor authentication for accounts</li>
        <li>Data encryption at rest</li>
      </ul>
    `,
    rights: `
      <p>You have the right to:</p>
      <ul class="section-list">
        <li>Access your personal information</li>
        <li>Correct inaccurate data</li>
        <li>Delete your information</li>
        <li>Opt-out of marketing communications</li>
        <li>Request data portability</li>
        <li>File complaints with data protection authorities</li>
      </ul>
    `,
    contact: `
      <p>Questions about this Privacy Policy? Contact us:</p>
      <p><strong>Email:</strong> shopora@gmail.com</p>
      <p><strong>Phone:</strong> +1 (555) 123-4567</p>
      <p><strong>Address:</strong> 123 Commerce Street, Business City, BC 12345</p>
      <p><strong>Response Time:</strong> Within 48 hours</p>
    `,
  };

  return content[sectionId] || "";
};

export default PrivacyPolicy;
