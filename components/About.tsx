export default function About() {
    return (
        <section id="about" className="section about-education-section">
            <div className="container">
                <h2 className="section-title">About & Education</h2>

                <div className="about-education-grid">
                    {/* Left: About */}
                    <div className="about-column">
                        <h3 className="subsection-title">About Me</h3>
                        <p className="about-text">
                            I&apos;m a second-year ISE student at RV College of Engineering
                            passionate about building software that solves real problems. My
                            journey in tech started with curiosity about how systems work
                            under the hood.
                        </p>

                        <p className="about-text">
                            I enjoy working across the stack — from low-level C programs to
                            full-stack web applications. When I&apos;m not coding,
                            you&apos;ll find me exploring new technologies.
                        </p>

                        <h4 className="interest-heading">Interests</h4>
                        <div className="interests">
                            <span className="interest-tag">Vibe coding</span>
                            <span className="interest-tag">Open Source</span>
                            <span className="interest-tag">Problem Solving</span>
                        </div>
                    </div>

                    {/* Right: Education */}
                    <div className="education-column">
                        <h3 className="subsection-title">Education</h3>

                        <div className="education-list">
                            <div className="education-item">
                                <div className="edu-header">
                                    <div>
                                        <h4>RV College of Engineering</h4>
                                        <p className="edu-degree">
                                            B.E. Information Science & Engineering
                                        </p>
                                    </div>
                                    <span className="edu-year">2024—28</span>
                                </div>
                            </div>

                            <div className="education-item">
                                <div className="edu-header">
                                    <div>
                                        <h4>Ambika PU College</h4>
                                        <p className="edu-degree">Pre-University • PCMCs</p>
                                    </div>
                                    <span className="edu-year">94.84%</span>
                                </div>
                            </div>

                            <div className="education-item">
                                <div className="edu-header">
                                    <div>
                                        <h4>Vivekananda High School</h4>
                                        <p className="edu-degree">State Board</p>
                                    </div>
                                    <span className="edu-year">99.52%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
