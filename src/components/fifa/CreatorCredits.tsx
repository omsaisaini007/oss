"use client";

import { motion } from "framer-motion";
import { Crown, Users } from "lucide-react";

const CREATORS = [
  { name: "OM SAI SAINI", initials: "OS", color: "#D4AF37" },
  { name: "ARHAAM SETHIA", initials: "AS", color: "#00E1FF" },
];

export function CreatorCredits() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 section-scroll bg-[#0a0a0a] border-t border-[rgba(212,175,55,0.15)]" id="credits">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Created By
            </span>
            <Crown className="w-4 h-4 text-[#D4AF37]" />
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-8">
            <span className="text-gold-gradient">The Team Behind FIFA Predictor</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {CREATORS.map((creator, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-gold rounded-2xl p-6 hover-lift"
                style={{ borderTop: `2px solid ${creator.color}` }}
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-black text-[#0B0B0B]"
                  style={{
                    background: `linear-gradient(135deg, ${creator.color}, #FFF5C8)`,
                    boxShadow: `0 0 20px ${creator.color}60`,
                  }}
                >
                  {creator.initials}
                </div>
                <h3 className="text-lg font-bold text-white">{creator.name}</h3>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#9a9a9a]">
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>© 2026 — Built with passion for the beautiful game</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
