import React, { useRef, useState, useEffect } from "react";

export const ContainerScroll = ({
  titleComponent,
  children,
}) => {
  const containerRef = useRef(null);
  const [scrollYProgress, setScrollYProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalDist = rect.height;
      const currentDist = windowHeight - rect.top;
      const progress = Math.min(1, Math.max(0, currentDist / (totalDist * 0.75)));
      setScrollYProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rotateX = 20 * (1 - scrollYProgress);
  const scale = 0.95 + 0.05 * scrollYProgress;
  const translateY = -30 * scrollYProgress;

  return (
    <div
      className="min-h-[85vh] flex items-center justify-center relative p-2 sm:p-8 w-full"
      ref={containerRef}
      id="experience"
    >
      <div
        className="w-full relative flex flex-col items-center"
        style={{
          perspective: "1200px",
        }}
      >
        {/* Header Title Component */}
        <div
          style={{
            transform: `translateY(${translateY}px)`,
            transition: "transform 0.1s ease-out"
          }}
          className="max-w-4xl mx-auto text-center mb-6 z-20"
        >
          {titleComponent}
        </div>

        {/* 3D Scrolling Perspective applied directly to phone container (no tablet wrapper) */}
        <div
          style={{
            transform: `rotateX(${rotateX}deg) scale(${scale})`,
            transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)",
            transformStyle: "preserve-3d",
          }}
          className="flex justify-center items-center relative w-full"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
