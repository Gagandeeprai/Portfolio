"use client";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function ProjectCard({
    title,
    type,
    description,
    features,
    tech,
    links,
}: any) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const { left, top } = event.currentTarget.getBoundingClientRect();
        const width = event.currentTarget.offsetWidth;
        const height = event.currentTarget.offsetHeight;

        const xPct = (event.clientX - left - width / 2) / width;
        const yPct = (event.clientY - top - height / 2) / height;

        x.set(xPct);
        y.set(yPct);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [-10, 10]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [10, -10]);

    return (
        <motion.article
            className="project-card"
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            <div style={{ transform: "translateZ(30px)" }}>
                <div className="project-header">
                    <h3>{title}</h3>
                    <span className="project-type">{type}</span>
                </div>

                <p className="project-description">{description}</p>

                <ul className="project-features">
                    {features.map((feature: string, i: number) => (
                        <li key={i}>{feature}</li>
                    ))}
                </ul>

                <div className="project-tech">
                    {tech}
                </div>

                <div className="project-links">
                    {links}
                </div>
            </div>
        </motion.article>
    );
}

export default function Projects() {
    return (
        <section id="projects" className="section projects">
            <div className="container">
                <h2 className="section-title">Projects</h2>

                <div className="projects-grid">
                    {/* Project 1 */}
                    <ProjectCard
                        title="pic2ascii"
                        type="CLI Tool"
                        description="Cross-platform C++17 command-line tool that converts images into colored or grayscale ASCII art, optimized for terminal display."
                        features={[
                            "Bilinear interpolation for smooth scaling",
                            "Adaptive contrast enhancement",
                            "Automatic terminal width detection",
                        ]}
                        tech={
                            <>
                                <i className="devicon-cplusplus-plain" aria-hidden="true"></i>
                                <span>C++17</span>
                            </>
                        }
                        links={
                            <a
                                href="https://github.com/Gagandeeprai/pic2ascii"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fab fa-github"></i> GitHub
                            </a>
                        }
                    />

                    {/* Project 2 */}
                    <ProjectCard
                        title="terminal-tetris"
                        type="Terminal-Game"
                        description="Terminal-based Tetris clone written in C using ncurses, featuring real-time input handling and dynamic difficulty."
                        features={[
                            "Collision detection & scoring system",
                            "Ghost piece projection",
                            "Pause / resume & responsive controls",
                        ]}
                        tech={
                            <>
                                <i className="devicon-c-plain" aria-hidden="true"></i>
                                <span>C</span>
                                <span>ncurses</span>
                            </>
                        }
                        links={
                            <a
                                href="https://github.com/Gagandeeprai/terminal-tetris"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fab fa-github"></i> GitHub
                            </a>
                        }
                    />

                    {/* Project 3 */}
                    <ProjectCard
                        title="Portfolio Website"
                        type="Web"
                        description="Modern portfolio built with Next.js 15, featuring 3D animations, custom interactions, and automated deployment."
                        features={[
                            "Next.js App Router & Static Export",
                            "Framer Motion for premium animations",
                            "Automated CI/CD via GitHub Actions",
                        ]}
                        tech={
                            <>
                                <i className="devicon-nextjs-plain" aria-hidden="true"></i>
                                <i className="devicon-typescript-plain" aria-hidden="true"></i>
                                <i className="devicon-tailwindcss-plain" aria-hidden="true"></i>
                            </>
                        }
                        links={
                            <>
                                <a
                                    href="https://gagandeeprai.github.io/Portfolio/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fas fa-arrow-up-right-from-square"></i> Live
                                </a>
                                <a
                                    href="https://github.com/Gagandeeprai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fab fa-github"></i> GitHub
                                </a>
                            </>
                        }
                    />
                </div>
            </div>
        </section>
    );
}
