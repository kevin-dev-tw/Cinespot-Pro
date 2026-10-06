import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer follow circle */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-white/50 mix-blend-difference hidden md:block"
        animate={{
          x: mousePosition.x - (isHovered ? 20 : 12),
          y: mousePosition.y - (isHovered ? 20 : 12),
          width: isHovered ? 40 : 24,
          height: isHovered ? 40 : 24,
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
        }}
        transition={{
          type: 'spring',
          damping: 26,
          stiffness: 320,
          mass: 0.4,
        }}
      />
      {/* Center point dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full bg-white mix-blend-difference hidden md:block"
        animate={{
          x: mousePosition.x - 2.5,
          y: mousePosition.y - 2.5,
          width: 5,
          height: 5,
        }}
        transition={{
          type: 'spring',
          damping: 40,
          stiffness: 900,
        }}
      />
    </>
  );
};
