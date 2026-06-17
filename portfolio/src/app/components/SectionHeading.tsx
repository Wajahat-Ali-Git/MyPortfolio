"use client";

import { motion } from "framer-motion";
import { itemVariants, colorStyles } from "./shared";

interface SectionHeadingProps {
  icon: React.ElementType;
  title: string;
  color: string;
  isRTL?: boolean;
}

export function SectionHeading({ icon: Icon, title, color, isRTL }: SectionHeadingProps) {
  const styles = colorStyles[color] || colorStyles.purple;
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="flex items-center gap-4 mb-14"
    >
      <div className={`p-3 rounded-xl ${styles.bg} border ${styles.border}`}>
        <Icon className={`w-6 h-6 ${styles.text}`} />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground dark:text-white/95">{title}</h2>
      <div className={`flex-1 h-px bg-gradient-to-${isRTL ? "l" : "r"} from-black/10 dark:from-white/20 to-transparent ${isRTL ? "mr-4" : "ml-4"}`} />
    </motion.div>
  );
}
