"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Hero() {
    const line1 = "ISE STUDENT";
    const line2 = "& LEARNER";

    const [line1Text, setLine1Text] = useState("");
    const [line2Text, setLine2Text] = useState("");
    const [index, setIndex] = useState(0);
    const [isLine1Done, setIsLine1Done] = useState(false);

    useEffect(() => {
        if (!isLine1Done) {
            if (index < line1.length) {
                const timer = setTimeout(() => {
                    setLine1Text((prev) => prev + line1[index]);
                    setIndex((prev) => prev + 1);
                }, 100);
                return () => clearTimeout(timer);
            } else {
                setIsLine1Done(true);
                setIndex(0); // Reset index for second line
            }
        } else {
            if (index < line2.length) {
                const timer = setTimeout(() => {
                    setLine2Text((prev) => prev + line2[index]);
                    setIndex((prev) => prev + 1);
                }, 100);
                return () => clearTimeout(timer);
            }
        }
    }, [index, isLine1Done, line1, line2]);

    return (
        <section id="hero" className="hero">
            {/* Header / Navigation */}
            <header className="site-header">
                <div className="container">
                    <h2 className="logo">Gagandeep Rai</h2>
                    <nav className="nav">
                        <a href="#about">About</a>
                        <a href="#skills">Skills</a>
                        <a href="#projects">Work</a>
                        <a href="#contact">Contact</a>
                    </nav>
                </div>
            </header>

            <div className="container hero-content">
                {/* LEFT: Profile Image */}
                <div className="hero-image">
                    <Image
                        src="/Portfolio/assets/your-img.jpg"
                        alt="Gagandeep Rai - ISE Student"
                        width={280}
                        height={280}
                        priority
                        className="rounded-full border-[3px] border-[var(--cyan)] shadow-2xl object-cover"
                        style={{ width: "280px", height: "280px" }}
                    />
                </div>

                {/* RIGHT: Text */}
                <div className="hero-text">
                    <p className="hero-intro">Hi, I&apos;m</p>
                    <h1 className="hero-title">
                        <div className="typewriter-line">
                            <span className="typewriter-text">{line1Text}</span>
                            {!isLine1Done && <span className="cursor">|</span>}
                        </div>
                        <div className="typewriter-line">
                            <span className="typewriter-text">{line2Text}</span>
                            {isLine1Done && <span className="cursor">|</span>}
                        </div>
                    </h1>
                    <p className="hero-description">
                        Information Science & Engineering student at RV College of Engineering.
                    </p>

                    <div className="hero-actions">
                        <a href="#projects" className="btn primary">
                            View Work
                        </a>
                        <a href="#contact" className="btn secondary">
                            Contact Me
                        </a>
                        <a
                            href="/Portfolio/assets/resume.pdf"
                            className="btn secondary"
                            download
                            target="_blank"
                        >
                            <i className="fas fa-download"></i> Resume
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
