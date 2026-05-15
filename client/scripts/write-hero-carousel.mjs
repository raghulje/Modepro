import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

let content = `import { useState, useEffect, useCallback } from "react";
import { homeData } from "@/mocks/homeData";
import PageHeader from "@/components/feature/PageHeader";

export default function HeroCarousel() {
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
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full overflow-hidden">
      <PageHeader className="absolute top-0 left-0 right-0 z-30" />

      {homeData.heroSlides.map((slide, index) => (
        <TAG
          key={index}
          className={\`absolute inset-0 transition-opacity duration-700 ease-in-out \${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }\`}
        >
          <img
            src={slide.image}
            alt=""
            className="w-full h-auto object-cover"
          />
        </TAG>
      ))}

      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        aria-label="Previous slide"
      >
        <i className="ri-arrow-left-s-line text-2xl" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        aria-label="Next slide"
      >
        <i className="ri-arrow-right-s-line text-2xl" />
      </button>

      <TAG className="absolute bottom-[7%] left-1/2 -translate-x-1/2 z-30 flex items-center gap-1">
        {homeData.heroSlides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={\`rounded-full border border-white transition-all duration-300 \${
              index === currentSlide
                ? "w-2.5 h-2.5 opacity-100 bg-brand border-brand"
                : "w-2.5 h-2.5 opacity-70 bg-transparent"
            }\`}
            aria-label={\`Go to slide \${index + 1}\`}
          />
        ))}
      </TAG>
    </section>
  );
}
`;

content = content.replaceAll("TAG", "div");

writeFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "../src/pages/home/components/HeroCarousel.tsx"
  ),
  content,
  "utf8"
);
