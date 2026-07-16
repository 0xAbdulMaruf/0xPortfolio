'use client';

import React, {
  useRef,
  useEffect,
  useState,
  TouchEvent,
} from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ICertificate } from '@/types';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

interface CertificateSliderProps {
    certificates: ICertificate[];
    companyColor: string;
    onCertClick: (cert: ICertificate) => void;
}

const CertificateSlider = ({
  certificates,
  companyColor,
  onCertClick,
}: CertificateSliderProps) => {
  const [active, setActive] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const minSwipeDistance = 50;
  
  const autoRotate = false; // Disabled auto-rotate so user can read certificates
  const rotateInterval = 4000;
  const cardHeight = 450;
  const items = certificates;

  useEffect(() => {
      setActive(0);
  }, [certificates]);

  useEffect(() => {
    if (autoRotate && isInView && !isHovering) {
      const interval = setInterval(() => {
        if (items.length > 0) setActive((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (carouselRef.current) {
        observer.observe(carouselRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Keyboard nav
  useEffect(() => {
      const handleKey = (e: KeyboardEvent) => {
          if (items.length === 0) return;
          if (e.key === 'ArrowLeft') {
              setActive((prev) => (prev - 1 + items.length) % items.length);
          }
          if (e.key === 'ArrowRight') {
              setActive((prev) => (prev + 1) % items.length);
          }
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
  }, [items.length]);

  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || items.length === 0) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  const getCardAnimationClass = (index: number) => {
    if (index === active) return "scale-100 opacity-100 z-20";
    if (index === (active + 1) % items.length)
      return "translate-x-[40%] scale-95 opacity-60 z-10";
    if (index === (active - 1 + items.length) % items.length)
      return "translate-x-[-40%] scale-95 opacity-60 z-10";
    return "scale-90 opacity-0 z-0 pointer-events-none";
  };

  if (items.length === 0) {
      return (
          <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground font-mono text-sm">
                  No certificates in this category
              </p>
          </div>
      );
  }

  return (
    <section
      className="bg-transparent min-w-full mx-auto flex flex-col items-center justify-center mt-8"
    >
      <div
        className="w-full px-4 sm:px-6 lg:px-8 min-w-[350px] md:min-w-[1000px] max-w-7xl"
      >
        <div
          className="relative overflow-hidden h-[500px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          ref={carouselRef}
        >
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            {items.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className={`absolute top-0 w-full max-w-md transform transition-all duration-500 cursor-pointer ${getCardAnimationClass(
                  index
                )}`}
                onClick={() => {
                    if (index === active) onCertClick(item);
                    else setActive(index);
                }}
              >
                <div
                  className="overflow-hidden bg-background border shadow-sm hover:shadow-md flex flex-col rounded-xl"
                  style={{ height: `${cardHeight}px`, borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <div
                    className="relative bg-black p-6 flex items-center justify-center h-56 overflow-hidden"
                    style={{
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40 transition-opacity hover:bg-black/20" />
                  </div>

                  <div className="p-6 flex flex-col flex-grow bg-card">
                    <h3 className="text-xl font-bold mb-1 text-foreground line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: companyColor }}></span>
                      {item.company}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-mono">
                            {item.category}
                          </span>
                          <span className="px-2 py-1 bg-secondary/50 text-muted-foreground rounded-md text-xs font-mono">
                            {item.date}
                          </span>
                      </div>

                      {item.verifyUrl && item.verifyUrl !== '#' && (
                        <a
                          href={item.verifyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary flex items-center hover:underline relative group text-sm font-mono"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="relative z-10">Verify Credential</span>
                          <ArrowRight className="ml-2 w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isMobile && items.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm border rounded-full flex items-center justify-center text-foreground hover:bg-background z-30 shadow-md transition-all hover:scale-110"
                onClick={() =>
                  setActive((prev) => (prev - 1 + items.length) % items.length)
                }
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm border rounded-full flex items-center justify-center text-foreground hover:bg-background z-30 shadow-md transition-all hover:scale-110"
                onClick={() => setActive((prev) => (prev + 1) % items.length)}
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {items.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center space-x-3 z-30">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      active === idx
                        ? "w-6"
                        : "hover:bg-muted-foreground/50"
                    }`}
                    style={{ backgroundColor: active === idx ? companyColor : 'rgba(255,255,255,0.2)' }}
                    onClick={() => setActive(idx)}
                    aria-label={`Go to item ${idx + 1}`}
                  />
                ))}
              </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CertificateSlider;
