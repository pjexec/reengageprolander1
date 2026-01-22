

import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent, motion, AnimatePresence } from 'framer-motion';
import { FRAMES } from '../sequence/frames';

const OVERLAYS = [
  {
    start: 0.0,
    end: 0.12,
    align: 'top',
    image: '/reengage-logo.png',
    title: 'ReEngage Pro',
    sub: 'Conservative re-engagement, automated.',
  },
  {
    start: 0.15,
    end: 0.28,
    align: 'top-left',
    title: 'Dormant segments aren’t harmless.',
    sub: 'They’re a deliverability risk sitting on untapped revenue.',
    compact: true,
  },
  {
    start: 0.31,
    end: 0.44,
    align: 'top-right',
    title: 'You stay in control.',
    sub: 'Nothing sends until you approve it.',
    compact: true,
  },
  {
    start: 0.47,
    end: 0.60,
    align: 'bottom-left',
    title: 'Pacing that protects reputation.',
    sub: 'Slow, segmented, monitored—built like a deliverability pro would do it.',
    compact: true,
  },
  {
    start: 0.63,
    end: 0.76,
    align: 'bottom-right',
    title: 'Signals, thresholds, safety rails.',
    sub: 'Bounces, complaints, blocks—guarded in real time.',
    compact: true,
  },
  {
    start: 0.95,
    end: 1.0,
    align: 'center',
    title: 'Cut ESP costs. Wake dormant revenue.',
    sub: 'Every reactivation pays twice.',
    lighterBg: true,
    cornerLogo: '/reengage-shield.png',
  },
];

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll progress for the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map 0-1 to 0-98 frames (since there are 99 frames)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAMES.length - 1]);

  // Fade out canvas at the end (from 80% to 90% scroll) so it's gone before final text
  const canvasOpacity = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);

  // Preload images
  useEffect(() => {
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];

    FRAMES.forEach((frameData) => {
      const img = new Image();
      img.src = frameData as unknown as string;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === FRAMES.length) {
          setIsLoading(false);
          // Initial draw
          requestAnimationFrame(() => drawFrame(0, imgs));
        }
      };
      img.onerror = () => {
        // Handle error gracefully, count as loaded to avoid blocking
        loaded++;
        setLoadedCount(loaded);
        if (loaded === FRAMES.length) setIsLoading(false);
      };
      imgs.push(img);
    });
    setImages(imgs);
  }, []);

  // Draw frame logic
  const drawFrame = (index: number, imgs: HTMLImageElement[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imgs[Math.round(index)];

    if (!canvas || !ctx || !img) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;

    // Check if canvas size matches window size needs
    // We want the canvas strictly to match window visual size * dpr
    const rect = canvas.getBoundingClientRect();
    const neededWidth = rect.width * dpr;
    const neededHeight = rect.height * dpr;

    if (canvas.width !== neededWidth || canvas.height !== neededHeight) {
      canvas.width = neededWidth;
      canvas.height = neededHeight;
      ctx.scale(dpr, dpr);
    }

    // Reset transform to handle clean slate specific for object-contain
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate aspect ratios
    const canvasTypeWidth = canvas.width;
    const canvasTypeHeight = canvas.height;

    const imgRatio = img.width / img.height;
    const canvasRatio = canvasTypeWidth / canvasTypeHeight;

    let renderW, renderH;

    if (canvasRatio > imgRatio) {
      // Canvas is wider than image -> fit to width to cover
      renderW = canvasTypeWidth;
      renderH = img.height * (canvasTypeWidth / img.width);
    } else {
      // Canvas is taller than image -> fit to height to cover
      renderH = canvasTypeHeight;
      renderW = img.width * (canvasTypeHeight / img.height);
    }

    const x = (canvasTypeWidth - renderW) / 2;
    const y = (canvasTypeHeight - renderH) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, x, y, renderW, renderH);
  };

  // Subscribe to scroll changes to redraw
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!isLoading && images.length > 0) {
      // Use requestAnimationFrame for performance
      requestAnimationFrame(() => drawFrame(latest, images));
    }
  });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!isLoading && images.length > 0) {
        drawFrame(frameIndex.get(), images);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoading, images, frameIndex]);


  return (
    <div ref={containerRef} className="relative h-[600vh] bg-[#DDDCDC]">

      {/* Fixed Canvas Container */}
      <div className="sticky top-0 z-0 h-screen w-full overflow-hidden">
        <motion.canvas
          ref={canvasRef}
          className="block h-full w-full"
          style={{ width: '100%', height: '100%', opacity: canvasOpacity }}
        />

        {/* Loading UI */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#DDDCDC] text-black"
            >
              <div className="w-64 h-1 bg-black/10 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-black transition-all duration-100 ease-out"
                  style={{ width: `${(loadedCount / FRAMES.length) * 100}%` }}
                />
              </div>
              <p className="font-mono text-xs opacity-60">
                LOADING SEQUENCE {Math.round((loadedCount / FRAMES.length) * 100)}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Overlays - Rendered inside the sticky container */}
        <div className="absolute inset-0 pointer-events-none">
          {OVERLAYS.map((item, i) => (
            <OverlayItem key={i} item={item} scrollProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Sub-component for individual overlays to handle their own opacity transforms
function OverlayItem({ item, scrollProgress }: { item: any, scrollProgress: any }) {
  // Opacity: fade in during the range
  // For the first item (start=0), we want it fully visible initially.
  const opacity = useTransform(
    scrollProgress,
    [item.start - 0.05, item.start, item.end, item.end + 0.05],
    [0, 1, 1, 0]
  );

  // Y translation: slide up slightly
  const y = useTransform(
    scrollProgress,
    [item.start - 0.05, item.end + 0.05],
    [50, -50]
  );

  const alignmentClasses: Record<string, string> = {
    'top': 'justify-start items-center text-center pt-[25vh]',
    'center': 'justify-center items-center text-center px-4',
    'top-left': 'justify-start items-start pt-8 pl-8 md:pt-12 md:pl-24 text-left',
    'top-right': 'justify-start items-end pt-8 pr-8 md:pt-12 md:pr-24 text-right',
    'bottom-left': 'justify-end items-start pb-12 pl-8 md:pb-24 md:pl-24 text-left',
    'bottom-right': 'justify-end items-end pb-12 pr-8 md:pb-24 md:pr-24 text-right',
    'left': 'justify-center items-start text-left pl-8 md:pl-20', // keeping as fallback
    'right': 'justify-center items-end text-right pr-8 md:pr-20', // keeping as fallback
  };

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 flex flex-col ${alignmentClasses[item.align] || alignmentClasses['center']}`}
    >
      <div className={`
        ${item.compact ? 'max-w-lg md:max-w-xl p-6' : 'max-w-xl md:max-w-2xl p-8'} 
        ${item.lighterBg ? 'bg-white/20' : 'bg-white/40'} 
        backdrop-blur-md border border-white/20 shadow-lg rounded-3xl transition-all duration-300
      `}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-32 md:h-48 w-auto mb-2 mx-auto object-contain"
          />
        ) : (
          <h2 className={`
            font-serif font-bold text-gray-900 mb-4 leading-tight
            ${item.compact ? 'text-3xl md:text-5xl' : 'text-4xl md:text-6xl'}
          `}>
            {item.title}
          </h2>
        )}
        {item.sub && (
          <p className={`
            font-sans text-gray-600 font-light
            ${item.compact ? 'text-base md:text-lg' : 'text-lg md:text-xl'}
          `}>
            {item.sub}
          </p>
        )}
        {item.cornerLogo && (
          <img
            src={item.cornerLogo}
            alt="Logo"
            className="absolute bottom-4 right-4 w-12 h-12 md:w-16 md:h-16 object-contain opacity-80"
          />
        )}
        {item.cta && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="pointer-events-auto mt-8 px-6 py-3 bg-black text-white font-sans font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            {item.cta}
          </button>
        )}
      </div>

      {/* Static scroll hint arrow - mainly for the first/logo card */}
      {item.image && (
        <div className="mt-8">
          <svg width="14" height="64" viewBox="0 0 14 64" fill="none" className="opacity-80">
            <path d="M7 0V64M7 64L1 56M7 64L13 56" stroke="black" strokeWidth="0.5" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
