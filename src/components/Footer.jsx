import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5">

  {/* Top Section */}
  <div className="container">

    <div className="row gy-4 pb-4">

          {/* ABOUT */}
          <div className="col-lg-2 col-md-4 col-sm-6">
            <p className="text-secondary small">ABOUT</p>

            <ul className="list-unstyled lh-lg">
              <li><Link to="#" className="text-light text-decoration-none">Contact Us</Link></li>
              <li><Link to="#" className="text-light text-decoration-none">About Us</Link></li>
              <li><Link to="#" className="text-light text-decoration-none">Careers</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div className="col-lg-2 col-md-4 col-sm-6">
            <p className="text-secondary small">HELP</p>

            <ul className="list-unstyled lh-lg">
              <li><Link to="#" className="text-light text-decoration-none">Payments</Link></li>
              <li><Link to="#" className="text-light text-decoration-none">Shipping</Link></li>
              <li><Link to="#" className="text-light text-decoration-none">Cancellation</Link></li>
              <li><Link to="#" className="text-light text-decoration-none">FAQ</Link></li>
            </ul>
          </div>

          {/* POLICY */}
          <div className="col-lg-3 col-md-4 col-sm-6">
            <p className="text-secondary small">CONSUMER POLICY</p>

            <ul className="list-unstyled lh-lg">
              <li><Link to="#" className="text-light text-decoration-none">Cancellation</Link></li>
              <li><Link to="#" className="text-light text-decoration-none">Terms</Link></li>
              <li><Link to="#" className="text-light text-decoration-none">Security</Link></li>
              <li><Link to="#" className="text-light text-decoration-none">Privacy</Link></li>
            </ul>
          </div>

          {/* MAIL */}
          <div className="col-lg-2 col-md-6 col-sm-6 border-start ps-4">

            <p className="text-secondary small">Mail Us</p>

            <a
              href="mailto:myapp@gmail.com"
              className="text-light text-decoration-none small d-block mb-3"
            >
              myapp@gmail.com
            </a>

            <p className="text-secondary small">Social</p>

            <div className="d-flex gap-3 fs-5">

              <a href="#" className="text-light">
                <i className="fa-brands fa-facebook"></i>
              </a>

              <a href="#" className="text-light">
                <i className="fa-brands fa-x-twitter"></i>
              </a>

              <a href="#" className="text-light">
                <i className="fa-brands fa-youtube"></i>
              </a>

              <a href="#" className="text-light">
                <i className="fa-brands fa-instagram"></i>
              </a>

            </div>
          </div>

          {/* ADDRESS */}
          <div className="col-lg-3 col-md-6 col-sm-6">

            <p className="text-secondary small">Registered Office</p>

            <p className="text-light text-decoration-none small lh-lg d-block mb-2">
              ABCD, Lucknow, 123456<br />
              Uttar Pradesh, India
            </p>

            <a
              href="tel:01234567890"
              className="text-info text-decoration-none small"
            >
              012-34567890
            </a>

            <span className="mx-2">/</span>

            <a
              href="tel:09876543210"
              className="text-info text-decoration-none small"
            >
              098-76543210
            </a>

          </div>

        </div>

  </div>


  {/* Bottom Section */}
  <div className="container-fluid border-top border-secondary py-3">

    <div className="container">

      <div className="row align-items-center">

        <div className="col-md-8 d-flex flex-wrap gap-4 small">

          <Link to="#" className="text-light text-decoration-none">
            Become a Seller
          </Link>

          <Link to="#" className="text-light text-decoration-none">
            Advertise
          </Link>

          <Link to="#" className="text-light text-decoration-none">
            Gift Cards
          </Link>

          <Link to="#" className="text-light text-decoration-none">
            Help Center
          </Link>

        </div>

        <div className="col-md-4 text-md-end mt-2 mt-md-0">

          <span>© 2007–2026 MyApp</span>

        </div>

      </div>

    </div>

  </div>

</footer>

  );
}
