"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dock() {
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        const sections = document.querySelectorAll("section");
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    return (
        <nav className="dock" aria-label="Main navigation">
            <a
                href="#hero"
                className={`dock-item ${activeSection === "hero" ? "active" : ""}`}
                aria-label="Home"
            >
                <i className="fas fa-house"></i>
            </a>
            <a
                href="#about"
                className={`dock-item ${activeSection === "about" ? "active" : ""}`}
                aria-label="About & Education"
            >
                <i className="fas fa-user"></i>
            </a>
            <a
                href="#skills"
                className={`dock-item ${activeSection === "skills" ? "active" : ""}`}
                aria-label="Skills"
            >
                <i className="fas fa-code"></i>
            </a>
            <a
                href="#projects"
                className={`dock-item ${activeSection === "projects" ? "active" : ""}`}
                aria-label="Projects"
            >
                <i className="fas fa-briefcase"></i>
            </a>
            <a
                href="#contact"
                className={`dock-item ${activeSection === "contact" ? "active" : ""}`}
                aria-label="Contact"
            >
                <i className="fas fa-envelope"></i>
            </a>
        </nav>
    );
}
