import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Share2, Code2, ExternalLink, Sparkles } from 'lucide-react';
import type { Speaker } from '../types';
import { AGENDA_ITEMS } from '../data/eventData';
import { playUiSound } from '../utils/audio';

interface SpeakerModalProps {
  speaker: Speaker | null;
  onClose: () => void;
}

export const SpeakerModal = ({ speaker, onClose }: SpeakerModalProps) => {
  if (!speaker) return null;

  const speakerSessions = AGENDA_ITEMS.filter((item) =>
    item.speakerIds.includes(speaker.id)
  );

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
        onClick={() => {
          playUiSound('close');
          onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f1017] border border-white/20 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)]"
        >
          {/* Close button */}
          <button
            onClick={() => {
              playUiSound('close');
              onClose();
            }}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Speaker Avatar & Meta */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-48 h-56 sm:w-56 sm:h-64 rounded-2xl overflow-hidden border border-white/20 shadow-xl mb-4 group">
                <img
                  src={speaker.avatar}
                  alt={speaker.name}
                  className="w-full h-full object-cover filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[11px] font-mono-code text-[#ccff00] bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  {speaker.timeSlot}
                </span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                {speaker.social.x && (
                  <a
                    href={speaker.social.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-[#00f0ff] transition-colors"
                    title="X / Twitter"
                  >
                    <Share2 size={15} />
                  </a>
                )}
                {speaker.social.github && (
                  <a
                    href={speaker.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors"
                    title="GitHub Repository"
                  >
                    <Code2 size={15} />
                  </a>
                )}
                {speaker.social.website && (
                  <a
                    href={speaker.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-[#ccff00] transition-colors"
                    title="Personal Site"
                  >
                    <Globe size={15} />
                  </a>
                )}
                {speaker.social.linkedin && (
                  <a
                    href={speaker.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-[#00f0ff] transition-colors"
                    title="Connect"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>

            {/* Speaker Information */}
            <div className="md:col-span-7 flex flex-col">
              <span className="text-xs font-mono-code text-[#ccff00] tracking-widest uppercase mb-1">
                {speaker.company}
              </span>
              <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                {speaker.name}
              </h3>
              <p className="font-sans text-sm font-medium text-neutral-300 mt-1 mb-4">
                {speaker.role}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {speaker.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono-code px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h4 className="text-xs font-mono-code text-neutral-400 uppercase tracking-wider mb-2">
                  Biography & Practice
                </h4>
                <p className="text-sm font-sans text-neutral-300 leading-relaxed">
                  {speaker.bio}
                </p>
              </div>

              {/* Sessions at Summit */}
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  Keynotes & Labs
                </h4>
                <div className="flex flex-col gap-2.5">
                  {speakerSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-mono-code text-neutral-400 mb-1">
                        <span>Day 0{session.day} • {session.time}</span>
                        <span className="text-[#ccff00]">{session.stage}</span>
                      </div>
                      <h5 className="font-display font-bold text-sm text-white">
                        {session.title}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
