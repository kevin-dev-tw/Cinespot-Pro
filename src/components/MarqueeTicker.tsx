import { motion } from 'framer-motion';

interface MarqueeTickerProps {
  items?: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}

export const MarqueeTicker = ({
  items = [
    "LOCOMOTIVE INERTIA SCROLL",
    "SPATIAL COMPUTING",
    "GENERATIVE ARCHITECTURE",
    "NEURAL VISUAL AESTHETICS",
    "WEBGPU 120FPS",
    "KINETIC TYPOGRAPHY",
    "INTERACTIVE PARTICLES",
    "VARIABLE MATRICES",
  ],
  reverse = false,
  className = "",
}: MarqueeTickerProps) => {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap select-none py-3 relative border-y border-white/10 bg-black/40 backdrop-blur-sm ${className}`}>
      <motion.div
        className="flex items-center gap-8 w-max"
        animate={{
          x: reverse ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 35,
          ease: "linear",
        }}
      >
        {repeated.map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 group">
            <span className="font-display font-extrabold text-xs md:text-sm tracking-[0.25em] text-neutral-300 group-hover:text-[#ccff00] transition-colors">
              {text}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]/60 group-hover:scale-150 transition-transform" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
