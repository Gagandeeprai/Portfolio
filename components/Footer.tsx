import Link from "next/link";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-copyright">
                        <p>&copy; {new Date().getFullYear()} Gagandeep Rai. All rights reserved.</p>
                    </div>
                    <div className="footer-links">
                        <a href="https://github.com/Gagandeeprai" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <i className="fab fa-github"></i>
                        </a>
                        <a href="https://linkedin.com/in/gagandeep-rai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <i className="fab fa-linkedin"></i>
                        </a>
                        <a href="mailto:gagandeepputtur@gmail.com" aria-label="Email">
                            <i className="fas fa-envelope"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
