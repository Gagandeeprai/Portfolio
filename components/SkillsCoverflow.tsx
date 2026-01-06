"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const skills = [
    { name: "C", icon: "devicon-c-plain" },
    { name: "C++", icon: "devicon-cplusplus-plain" },
    { name: "Python", icon: "devicon-python-plain" },
    { name: "Docker", icon: "devicon-docker-plain" },
    { name: "SQL", icon: "devicon-mysql-plain" },
    { name: "Linux", icon: "devicon-linux-plain" },
    { name: "Git", icon: "devicon-git-plain" },
    { name: "HTML", icon: "devicon-html5-plain" },
    { name: "CSS", icon: "devicon-css3-plain" },
    { name: "JavaScript", icon: "devicon-javascript-plain" },
];

export default function SkillsCoverflow() {
    const [index, setIndex] = useState(Math.floor(skills.length / 2));
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startMouseX, setStartMouseX] = useState(0);

    const total = skills.length;

    const goToPrev = useCallback(() => {
        setIndex((prev) => (prev - 1 + total) % total);
    }, [total]);

    const goToNext = useCallback(() => {
        setIndex((prev) => (prev + 1) % total);
    }, [total]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                goToPrev();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                goToNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goToNext, goToPrev]);

    // Touch support
    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (diff > 50) goToNext();
        else if (diff < -50) goToPrev();
    };

    // Mouse Drag support
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartMouseX(e.clientX);
        if (trackRef.current) trackRef.current.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const endX = e.clientX;
        const diff = startMouseX - endX;
        if (diff > 50) goToNext();
        else if (diff < -50) goToPrev();

        setIsDragging(false);
        if (trackRef.current) trackRef.current.style.cursor = "grab";
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if (trackRef.current) trackRef.current.style.cursor = "grab";
        }
    };

    const getCardClass = (i: number) => {
        let diff = i - index;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        if (diff === 0) return "active";
        if (diff === -1) return "left-1";
        if (diff === -2) return "left-2";
        if (diff <= -3) return "left-3";
        if (diff === 1) return "right-1";
        if (diff === 2) return "right-2";
        if (diff >= 3) return "right-3";
        return "";
    };

    return (
        <section id="skills" className="section skills">
            <div className="container">
                <h2 className="section-title">Skills</h2>

                <div className="coverflow">
                    <button
                        className="cf-btn left"
                        aria-label="Previous skill"
                        onClick={goToPrev}
                    >
                        &#10094;
                    </button>

                    <div
                        className="coverflow-track"
                        ref={trackRef}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: "grab" }}
                    >
                        {skills.map((skill, i) => {
                            const cardClass = getCardClass(i);
                            return (
                                <div
                                    key={skill.name}
                                    className={`cf-card ${cardClass}`}
                                    role="article"
                                    aria-label={`${skill.name} programming language`}
                                    onClick={() => setIndex(i)}
                                    tabIndex={cardClass === "active" ? 0 : -1}
                                    aria-current={cardClass === "active" ? "true" : undefined}
                                >
                                    <i className={skill.icon} aria-hidden="true"></i>
                                    <span>{skill.name}</span>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        className="cf-btn right"
                        aria-label="Next skill"
                        onClick={goToNext}
                    >
                        &#10095;
                    </button>
                </div>
            </div>
        </section>
    );
}
