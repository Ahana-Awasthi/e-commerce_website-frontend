import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ScrollCards.css";

import beauty from "../assets/sc1.png";
import shoes from "../assets/sc2.png";
import dress from "../assets/sc3.png";
import kids from "../assets/sc4.png";
import home from "../assets/sc5.png";
import skincare from "../assets/sc6.png";
import accessories from "../assets/sc7.png";
import electronics from "../assets/sc8.png";
import fitness from "../assets/sc9.png";
import fragrance from "../assets/sc10.png";
import watch from "../assets/sc11.png";
import bags from "../assets/sc12.png";
import sunglasses from "../assets/sc13.png";
import stationery from "../assets/sc14.png";
import grooming from "../assets/sc15.png";

const cardData = [
    { text: "Beauty Products", image: beauty },
    { text: "Men's Shoes", image: shoes },
    { text: "Women's Dresses", image: dress },
    { text: "Kids New Arrivals", image: kids },
    { text: "Home Decor", image: home },
    { text: "Skincare", image: skincare },
    { text: "Accessories", image: accessories },
    { text: "Electronics", image: electronics },
    { text: "Fitness Gear", image: fitness },
    { text: "Fragrances", image: fragrance },
    { text: "Watches", image: watch },
    { text: "Bags & Wallets", image: bags },
    { text: "Sunglasses", image: sunglasses },
    { text: "Stationery", image: stationery },
    { text: "Grooming Kits", image: grooming },
];

const ScrollCard = ({ textPlaceholder, imageSrc, altText }) => (
    <div className="scroll-card flex-shrink-0 mx-4">
        <div className="card h-100 text-white d-flex align-items-center border-5 border-dark-subtle">
            <span className="card-gradient"></span>
            <div className="card-image">
                <img
                    src={imageSrc}
                    alt={altText}
                    className="img-fluid"
                    style={{ height: "100%", objectFit: "cover" }}
                />
            </div>
        </div>
    </div>
);

const ScrollCards = () => {
    const visibleCount = 5; // number of cards visible at a time
    const autoplayInterval = 5000;
    const pauseTime = 9000;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Autoplay
    useEffect(() => {
        if (isPaused) return;
        const autoplay = setInterval(() => {
            scrollRight();
        }, autoplayInterval);
        return () => clearInterval(autoplay);
    }, [isPaused]);

    const pauseAutoplay = () => {
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), pauseTime);
    };

    const scrollLeft = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + cardData.length) % cardData.length
        );
        pauseAutoplay();
    };

    const scrollRight = () => {
        setCurrentIndex((prev) => (prev + 1) % cardData.length);
        pauseAutoplay();
    };

    // Generate visible cards with index-based circular logic
    const visibleCards = [];
    for (let i = 0; i < visibleCount; i++) {
        const index = (currentIndex + i) % cardData.length;
        visibleCards.push({ ...cardData[index], idx: index });
    }

    return (
        <div className="scroll-cards-container position-relative my-4">
            {/* Left arrow */}
            <button
                className="btn btn-dark scroll-btn pb-4 position-absolute top-50 start-0 translate-middle-y z-3"
                onClick={scrollLeft}
                style={{ opacity: 0.7 }}
            >
                &#8249;
            </button>

            {/* Cards container */}
            <div className="d-flex overflow-hidden" style={{ position: "relative" }}>
                <motion.div
                    key={currentIndex}
                    className="d-flex"
                    initial={{ x: 300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                >
                    {visibleCards.map((card) => (
                        <ScrollCard
                            key={card.idx}
                            textPlaceholder={<h5>{card.text}</h5>}
                            imageSrc={card.image}
                            altText={card.text}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Right arrow */}
            <button
                className="btn btn-dark scroll-btn pb-4 position-absolute top-50 end-0 translate-middle-y z-3"
                onClick={scrollRight}
            >
                &#8250;
            </button>
        </div>
    );
};

export default ScrollCards;
