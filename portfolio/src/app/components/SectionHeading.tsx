"use client";

import { motion } from "framer-motion";
import { itemVariants, colorStyles } from "./shared";

interface SectionHeadingProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  color: string;
  isRTL?: boolean;
}

export function SectionHeading({ icon: Icon, title, description, color, isRTL }: SectionHeadingProps) {
  const styles = colorStyles[color] || colorStyles.purple;
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="mb-10 sm:mb-14"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${styles.bg} border ${styles.border} shrink-0`}>
          <Icon className={`w-6 h-6 ${styles.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground dark:text-white/95">{title}</h2>
        </div>
        <div className={`hidden sm:block flex-1 h-px bg-gradient-to-${isRTL ? "l" : "r"} from-black/10 dark:from-white/20 to-transparent ${isRTL ? "mr-4" : "ml-4"}`} />
      </div>
      {description && (
        <p className={`mt-2.5 text-xs sm:text-sm md:text-base text-[var(--muted-foreground)] max-w-3xl leading-relaxed ${isRTL ? "pr-16" : "pl-16"}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
