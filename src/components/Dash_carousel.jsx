import { useState } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import img1 from "../assets/carousel_al.jpg";
import img2 from "../assets/caros1.jpg";
import img3 from "../assets/carousel_al3.webp";
import img4 from "../assets/caros4.jpg";
import "./Dash_carousel.css"

  
export default function Dash_carousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const slides = [img1, img2, img3, img4];
  const imgLinks = [
    "/Shop/Men",
    "/Shop/Beauty",
    "/Shop/Electronics",
    "/Shop/Kids",
  ];
  return (
    <div className="hero-carousel">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        fade
        interval={3000}
        pause="hover"
        touch={true}
        indicators={true}
        controls={true}
      >
        {slides.map((img, i) => (
          <Carousel.Item key={i}>
            <Link to={imgLinks[i]}>
              <img
                className="d-block w-100 carousel-img"
                src={img}
                alt={`slide-${i}`}
              />
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
