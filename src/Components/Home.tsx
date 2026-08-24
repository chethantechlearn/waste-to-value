import React, { useState, useEffect } from "react";

import data from "../data/data.json";

import SlideshowModal from "./SlideshowModal";
import varlogo from "../assets/logo.png"

export interface DocumentData {
  id: string;

  title: string;

  filename: string;

  path: string;

  description: string;
}

export interface MetricData {
  value: string;

  label: string;

  sourceName?: string;

  sourceUrl?: string;
}

export interface CardData {
  title: string;

  description: string;
}

export interface ProcessStepData {
  step: string;

  title: string;

  desc: string;
}

export interface ImageData {
  url: string;

  title: string;

  caption: string;
}

export interface SectionData {
  id: string;

  badge: string;

  heading: string;

  subHeading: string;

  navTitle?: string;

  cards?: CardData[];

  processSteps?: ProcessStepData[];

  images?: ImageData[];

  metrics?: MetricData[];
}

export interface AppData {
  projectTitle: string;

  tagline: string;

  subtitle: string;

  heroBgImage?: string;

  documents?: DocumentData[];

  sections: SectionData[];
}

const appData = data as AppData;

export default function Home() {
  const [navVisible, setNavVisible] = useState(true);

  const [lastScrollY, setLastScrollY] = useState(0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isPresenterOpen, setIsPresenterOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
          } else {
            entry.target.classList.remove("reveal");
          }
        });
      },

      { threshold: 0.15, rootMargin: "-20px 0px -5% 0px" },
    );

    const sections = document.querySelectorAll(".section-container");

    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    e.preventDefault();

    setMobileMenuOpen(false);

    if (targetId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });

      return;
    }

    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <nav className={`navbar ${!navVisible ? "hidden" : ""}`}>
        <a
          href="#hero"
          className="nav-brand"
          onClick={(e) => handleNavClick(e, "hero")}
        >
          <img src={varlogo} alt={appData.projectTitle} />
        </a>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          {appData.sections.map((sec) => (
            <li key={sec.id}>
              <a href={`#${sec.id}`} onClick={(e) => handleNavClick(e, sec.id)}>
                {sec.navTitle || sec.heading}
              </a>
            </li>
          ))}

          <li>
            <button
              className="presenter-btn"
              onClick={() => setIsPresenterOpen(true)}
            >
              📺 Presenter Mode
            </button>
          </li>
        </ul>
      </nav>

      <header
        id="hero"
        className="hero"
        style={{
          backgroundImage: appData.heroBgImage
            ? `linear-gradient(180deg, rgba(3, 28, 21, 0.75) 0%, rgba(3, 28, 21, 0.92) 100%), url(${appData.heroBgImage})`
            : undefined,
        }}
      >
        <div className="hero-glass-card">
          <span className="hero-badge">{appData.tagline}</span>

          <h1 className="hero-title">{appData.projectTitle}</h1>

          <p className="hero-subtitle">{appData.subtitle}</p>

          {appData.documents && appData.documents.length > 0 && (
            <div
              className="hero-docs-box"
              style={{ marginTop: "30px", width: "100%" }}
            >
              <h4
                style={{
                  color: "var(--clr-accent-gold)",
                  marginBottom: "12px",
                  fontSize: "1rem",
                }}
              >
                📂 Available Seminar Presentation Files:
              </h4>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {appData.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.path}
                    download={doc.filename}
                    className="slide-nav-btn"
                    style={{
                      fontSize: "0.85rem",
                      padding: "10px 20px",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    📥 Download {doc.title} (.pptx)
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {appData.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="section-container"
          >
            <div className="section-header">
              <span className="section-badge">{section.badge}</span>

              <h2 className="section-heading">{section.heading}</h2>

              <p className="section-subheading">{section.subHeading}</p>
            </div>

            <div className="grid-2col">
              <div>
                {section.cards &&
                  section.cards.map((card: CardData, idx: number) => (
                    <div key={idx} className="info-card">
                      <h3>{card.title}</h3>

                      <p>{card.description}</p>
                    </div>
                  ))}

                {section.processSteps && (
                  <div className="process-grid">
                    {section.processSteps.map(
                      (step: ProcessStepData, idx: number) => (
                        <div key={idx} className="process-card">
                          <div className="process-number">{step.step}</div>

                          <h4 style={{ color: "#fff", margin: "6px 0" }}>
                            {step.title}
                          </h4>

                          <p style={{ color: "#a7f3d0", fontSize: "0.85rem" }}>
                            {step.desc}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              {section.images && section.images.length > 0 && (
                <div>
                  <ImageViewer images={section.images} />
                </div>
              )}
            </div>
          </section>
        ))}
      </main>

      <SlideshowModal
        isOpen={isPresenterOpen}
        onClose={() => setIsPresenterOpen(false)}
        sections={appData.sections}
      />
    </div>
  );
}

function ImageViewer({ images }: { images: ImageData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isMultiple = images.length > 1;

  const currentImg = images[currentIndex];

  return (
    <div className="image-viewer">
      <img src={currentImg.url} alt={currentImg.title} />

      {isMultiple && (
        <>
          <button
            className="slider-btn prev"
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + images.length) % images.length,
              )
            }
          >
            &#10094;
          </button>

          <button
            className="slider-btn next"
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % images.length)
            }
          >
            &#10095;
          </button>
        </>
      )}

      <div className="image-caption-overlay">
        <h4>{currentImg.title}</h4>

        <p>{currentImg.caption}</p>
      </div>
    </div>
  );
}
