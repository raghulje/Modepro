import { useEffect, useRef, useState, useCallback } from "react";
import { galleryData } from "@/mocks/galleryData";

export default function GalleryGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const goNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % galleryData.images.length);
    }
  }, [lightboxIndex]);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + galleryData.images.length) % galleryData.images.length
      );
    }
  }, [lightboxIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  return (
    <>
      <section ref={sectionRef} className="py-6 md:py-10 bg-white all-page-main-mrg-line">
        <div className="container-site">
          <div
            className={`gallery-row transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {galleryData.images.map((img, index) => (
              <div key={index} className="gallery-col">
                <a
                  href={img.full}
                  className="lightbox main-gal-photo-line"
                  onClick={(e) => {
                    e.preventDefault();
                    openLightbox(index);
                  }}
                >
                  <img
                    src={img.thumb}
                    alt=""
                    className="img-responsive"
                    loading="lazy"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-3xl w-10 h-10 flex items-center justify-center hover:text-brand transition-colors z-50 cursor-pointer"
            aria-label="Close lightbox"
          >
            ×
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl w-10 h-10 flex items-center justify-center hover:text-brand transition-colors z-50 cursor-pointer"
            aria-label="Previous image"
          >
            ‹
          </button>

          <img
            src={galleryData.images[lightboxIndex].full}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl w-10 h-10 flex items-center justify-center hover:text-brand transition-colors z-50 cursor-pointer"
            aria-label="Next image"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {lightboxIndex + 1} / {galleryData.images.length}
          </div>
        </div>
      )}
    </>
  );
}
