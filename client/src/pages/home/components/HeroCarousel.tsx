import { useState, useEffect, useCallback } from "react";
import { useSiteData } from "@/contexts/SiteDataContext";
import PageHeader from "@/components/feature/PageHeader";

export default function HeroCarousel() {
  const { data: homeData } = useSiteData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % homeData.heroSlides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(
      (currentSlide - 1 + homeData.heroSlides.length) %
        homeData.heroSlides.length
    );
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 10000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <PageHeader className="absolute top-0 left-0 right-0 z-30" />

      <div className="relative w-full">
        {homeData.heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`w-full transition-opacity duration-700 ease-in-out ${
              index === currentSlide
                ? "relative z-10 opacity-100"
                : "absolute inset-0 z-0 opacity-0 pointer-events-none"
            }`}
            aria-hidden={index !== currentSlide}
          >
            <img
              src={slide.image}
              alt={slide.alt ?? ""}
              className="block w-full h-auto"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prevSlide}
        className="carousel-control carousel-control-prev"
        aria-label="Previous slide"
      >
        <span className="carousel-control-icon" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="carousel-control carousel-control-next"
        aria-label="Next slide"
      >
        <span className="carousel-control-icon carousel-control-icon-next" aria-hidden="true" />
      </button>

      <ol className="carousel-indicators">
        {homeData.heroSlides.map((_, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => goToSlide(index)}
              className={index === currentSlide ? "is-active" : ""}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : undefined}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
