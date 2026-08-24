import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

interface SlideshowModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: any[];
}

export default function SlideshowModal({
  isOpen,
  onClose,
  sections,
}: SlideshowModalProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (isOpen) setCurrentIndex(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(prev + 1, sections.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, sections.length, onClose]);

  if (!isOpen || !sections || sections.length === 0) return null;

  const currentSection = sections[currentIndex];

  return ReactDOM.createPortal(
    <div className="slideshow-modal-overlay">
      <div className="slideshow-container">
        <div className="slideshow-header">
          <span className="slideshow-counter">
            Slide {currentIndex + 1} of {sections.length}
          </span>
          <button
            className="slideshow-close-btn"
            onClick={onClose}
            aria-label="Close presentation"
          >
            ✕
          </button>
        </div>

        <div className="slideshow-body">
          <div className="slideshow-content-card">
            {currentSection.badge && (
              <span className="section-badge">{currentSection.badge}</span>
            )}
            <h2 className="section-heading">{currentSection.heading}</h2>
            <p className="section-subheading">{currentSection.subHeading}</p>

            {currentSection.metrics && currentSection.metrics.length > 0 && (
              <div className="slide-metrics-grid">
                {currentSection.metrics.map((m: any, idx: number) => (
                  <div key={idx} className="metric-box">
                    <span className="metric-value">{m.value}</span>
                    <span className="metric-label">{m.label}</span>
                  </div>
                ))}
              </div>
            )}

            {currentSection.cards && (
              <div className="slide-cards-list">
                {currentSection.cards.map((c: any, idx: number) => (
                  <div key={idx} className="info-card">
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {currentSection.images && currentSection.images.length > 0 && (
            <div className="slideshow-image-container">
              <img
                src={currentSection.images[0].url}
                alt={currentSection.images[0].title}
              />
              <div className="image-caption-overlay">
                <h4>{currentSection.images[0].title}</h4>
                <p>{currentSection.images[0].caption}</p>
              </div>
            </div>
          )}
        </div>

        <div className="slideshow-footer">
          <button
            className="slide-nav-btn"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
          >
            ← Previous
          </button>
          <button
            className="slide-nav-btn"
            disabled={currentIndex === sections.length - 1}
            onClick={() => setCurrentIndex((prev) => prev + 1)}
          >
            Next →
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
