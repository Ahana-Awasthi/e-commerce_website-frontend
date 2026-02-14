import React from "react";
import "./AboutPage.css";
import blur from "../assets/blur.png"; // ✅ Import image

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
    return (
        <>
            <div
                className="about-vadilal-section d-flex justify-content-center align-items-center"
                style={{ backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.55), rgba(15, 15, 15, 0.55)), url(${blur})` }}
            >
                <div className="about-oval text-center">
                    <h1 className="about-heading">Meet Swift Cart</h1>
                    <h2 className="about-subheading">Where Style Meets Every Day</h2>
                    <p className="about-paragraph">
                        Welcome to <strong>Swift Cart</strong>, your one-stop destination for [product types] that add a touch of style and comfort to everyday life. From trendy picks to timeless favorites, we make sure every product delivers quality you can trust and a little spark of happiness every time you click “add to cart.” Your perfect find is just a scroll away!
                    </p>
                </div>
            </div>
            <div>
                <div className='d-flex parent overflow-hidden gap-3'>
                    <div id='one'>
                        <div> <img src={b1} alt="Logo" className="heroimg" /></div>
                        <div className='my-3'> <img src={b2} alt="Logo" className="heroimg" /></div>
                    </div>
                    <div id='two'>
                        <div> <img src={b10} alt="Logo" className="heroimg" /></div>
                        <div className='my-3'> <img src={b3} alt="Logo" className="heroimg" /></div>
                        <div> <img src={b9} alt="Logo" className="heroimg" /></div>
                    </div>
                    <div id='three'>
                        <div> <img src={b4} alt="Logo" className="heroimg" /></div>
                        <div className='my-3'> <img src={b7} alt="Logo" className="heroimg" /></div>
                        <div> <img src={b1} alt="Logo" className="heroimg" /></div>
                    </div>
                    <div id='four'>
                        <div> <img src={b9} alt="Logo" className="heroimg" /></div>
                        <div className='my-3'> <img src={b6} alt="Logo" className="heroimg" /></div>
                        <div> <img src={b5} alt="Logo" className="heroimg" /></div>
                    </div>
                    <div className='extra'></div>
                    <div id='five'>
                        <div> <img src={b5} alt="Logo" className="heroimg" /></div>
                        <div className='my-3'> <img src={b8} alt="Logo" className="heroimg" /></div>
                    </div>
                </div>
                <div>
                    <div>
                    </div>
                    <div className='heading'>
                        <span>Log in to get <br /> your ideas</span>
                    </div>
                    <div className='mid py-3 px-5'>
                        <div className='bg-primary p-2 rounded-3 mb-3'>
                            <span>
                                Facebook login is no longer available. Log in with an option below or tap to recover your account
                            </span>
                        </div>
                        <div className='px-5'>
                            <i class="fa-brands fa-pinterest fs-2 ms-5 ps-5" style={{ color: '#ec1818' }}></i>
                            <h2 className='fw-bold text-center'>Welcome to Pinterest</h2></div>
                        <div className='login-form px-3'>
                            <form>
                                <div className='mb-1'>
                                    <label htmlFor='email' className='form-label'>Email address</label>
                                    <input
                                        type='email'
                                        className='form-control rounded-4 py-2 px-3'
                                        id='email'
                                        placeholder='Email'
                                    />
                                </div>

                                <div className='mb-1 position-relative'>
                                    <label htmlFor='password' className='form-label'>Password</label>
                                    <div className='input-group'>
                                        <input
                                            type='password'
                                            className='form-control rounded-4 py-2 px-3'
                                            id='password'
                                            placeholder='Password'
                                        />
                                        <span className='position-absolute end-0 top-50 translate-middle-y pe-3'>
                                            <i className='fa-regular fa-eye'></i>
                                        </span>
                                    </div>
                                </div>

                                <div className='mb-3 text-start'>
                                    <a href='#' className='text-primary text-decoration-none fw-semibold'>
                                        Forgotten your password?
                                    </a>
                                </div>

                                <div className='d-grid mb-3'>
                                    <button className='btn btn-danger rounded-4 py-2 fw-bold' type='submit'>
                                        Log in
                                    </button>
                                </div>

                                <div className='text-center fw-bold my-2'>OR</div>

                                <div className='d-grid mb-2'>
                                    <button className='btn btn-light border rounded-2 py-2'>
                                        <i className='fa-brands fa-google me-4'></i> Continue with Google
                                    </button>
                                </div>

                                <div className='d-grid'>
                                    <button className='btn btn-light border rounded-2 py-2'>
                                        <i className='fa-solid fa-qrcode me-5'></i> Use QR code
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default AboutPage;
