"use client";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SkillsCoverflow from "@/components/SkillsCoverflow";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Dock from "@/components/Dock";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or wait for hydration
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatedBackground />


      <div className={`loading-screen ${loading ? "" : "hidden"}`}>
        <div className="loader"></div>
      </div>

      {!loading && <Dock />}

      <main>
        <Hero />
        <About />
        <SkillsCoverflow />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
