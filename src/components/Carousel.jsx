import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../assets/p1.jpg';
import img2 from '../assets/p2.png';
import img3 from '../assets/p3.png';
import img4 from '../assets/p4.png';

import { ReactTyped } from "react-typed";
import './Carousel.css';

function ControlledCarousel() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <div style={{ position: "relative" }}>
            {/* Carousel */}
            <Carousel activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item>
                    <img style={{ objectFit: 'cover', height: '500px' }}
                        className="d-block w-100"
                        src={img1} alt="First slide" />
                </Carousel.Item>

                <Carousel.Item>
                    <img style={{ objectFit: 'cover', height: '500px' }}
                        className="d-block w-100"
                        src={img3}
                        alt="Second slide"
                    />
                </Carousel.Item>

                <Carousel.Item>
                    <img style={{ objectFit: 'cover', height: '500px' }}
                        className="d-block w-100"
                        src={img2}
                        alt="Third slide"
                    />
                </Carousel.Item>

                <Carousel.Item>
                    <img style={{ objectFit: 'cover', height: '500px' }}
                        className="d-block w-100"
                        src={img4}
                        alt="Third slide"
                    />
                </Carousel.Item>
            </Carousel>

            {/* Typed text overlay (on all slides) */}
            <div style={{
                position: "absolute",
                bottom: "15%",
                left: "48%",
                transform: "translateX(-50%)",
                color: "white",
                textAlign: "center",
                padding: "10px",
                borderRadius: "10px",
                zIndex: 10
            }}>
                <h1>
                    <ReactTyped
                        strings={[
                            "🔥 Flat 50% OFF on Electronics",
                            "👗 New Fashion Arrivals – Shop Now",
                            "🚚 Free Delivery Above ₹999",
                            "🎉 Buy 1 Get 1 Free – Limited Time!"
                        ]}
                        typeSpeed={60}
                        backSpeed={40}
                        loop
                    />
                </h1>
            </div>
        </div>
    );
}

export default ControlledCarousel;
