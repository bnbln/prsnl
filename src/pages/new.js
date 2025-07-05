import React, { useMemo, useRef, useEffect } from 'react';
import { Box} from '@chakra-ui/react';
import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMenuData, getFooterData } from '../hooks/useMenuData';

// Removed menu and footer data fetching as they are handled elsewhere
export async function getStaticProps() {
  try {
    const menuData = await getMenuData();
    const footerData = await getFooterData();

    return {
      props: {
        navData: menuData[0],
        footerData: footerData[0],
      },
    };
  } catch (error) {
    console.error('Error fetching menu or footer data:', error);
    return {
      props: {
        navData: null,
        footerData: null,
      },
    };
  }
}


/* MAIN LANDING PAGE */
export default function LandingPage({ navData, footerData }) {
  const canvasRef = useRef(null);

  // ----- image‑sequence configuration -----
  const frameCount = 999; // ← replace with your exact frame total
  const currentFrame = (index) =>
    `/hero/${String(index).padStart(4, '0')}.jpg`; // frames live in /public/hero

  // Pre‑load the images once
  const images = useMemo(() => {
    // During SSR `window` is undefined, so skip image construction
    if (typeof window === 'undefined') return [];

    const arr = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new window.Image();
      img.src = currentFrame(i);
      arr.push(img);
    }
    return arr;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    let ScrollTriggerInstance = null;

    (async () => {
      // Dynamically import to avoid SSR issues
      const mod = await import('gsap/ScrollTrigger');
      const ScrollTrigger = mod.ScrollTrigger || mod.default;
      ScrollTriggerInstance = ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // set canvas to your sprite dimensions
      canvas.width = 1920;  // width of a single frame
      canvas.height = 1080; // height of a single frame

      // draw first frame when it loads (ensure images exist)
      if (images.length) {
        const first = images[0];
        if (first.complete && first.naturalWidth !== 0) {
          context.drawImage(first, 0, 0);
        } else {
          first.onload = () => context.drawImage(first, 0, 0);
        }
      }

      const playhead = { frame: 0 };

      gsap.to(playhead, {
        frame: frameCount - 1,
        ease: 'none',
        snap: 'frame',
        onUpdate: () => {
          const frame = Math.round(playhead.frame);
          const img = images[frame];
          // only draw if the image is fully loaded and not broken
          if (img && img.complete && img.naturalWidth !== 0) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0);
          }
        },
        scrollTrigger: {
          trigger: canvas,
          start: 'top top',
          end: `+=${window.innerHeight * 3}`, // 3× viewport scroll
          scrub: 1,
          pin: true,
        },
      });
    })();

    // cleanup on unmount
    return () => {
      if (ScrollTriggerInstance) {
        ScrollTriggerInstance.getAll().forEach((t) => t.kill());
      }
    };
  }, [images]);

  return (
    <Box as="section" position="relative" height="100vh" width="100%" overflow="hidden">
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </Box>
  );
}