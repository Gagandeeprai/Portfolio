import Link from "next/link";

export default function Contact() {
    return (
        <section id="contact" className="section contact">
            <div className="container">
                <h2 className="section-title">Contact</h2>

                <p className="contact-intro">
                    I&apos;m currently <span>open to internships</span> and
                    collaborations. Feel free to reach out.
                </p>

                <div className="contact-center">
                    <a
                        href="mailto:gagandeepputtur@gmail.com"
                        className="btn primary big-btn"
                    >
                        <i className="fas fa-envelope"></i> Send Me an Email
                    </a>

                    <div className="social-links">
                        <a
                            href="https://linkedin.com/in/gagandeep-rai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-item"
                        >
                            <i className="fab fa-linkedin"></i> LinkedIn
                        </a>

                        <a
                            href="https://github.com/Gagandeeprai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-item"
                        >
                            <i className="fab fa-github"></i> GitHub
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
