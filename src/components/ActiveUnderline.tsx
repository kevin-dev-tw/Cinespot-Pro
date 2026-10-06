import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';

const ACTIVE_UNDERLINE_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 28,
};

interface ActiveUnderlineProps {
  layoutId: string;
  className?: string;
}

export const ActiveUnderline = ({ layoutId, className = '' }: ActiveUnderlineProps) => (
  <motion.div
    layoutId={layoutId}
    className={`absolute bottom-0 h-[2.5px] bg-[#e50914] ${className}`}
    transition={ACTIVE_UNDERLINE_TRANSITION}
  />
);
