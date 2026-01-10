"use client";
import { motion } from "motion/react";

export default function FadeIn({ children }: { children: React.ReactNode }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 2.5, ease: "easeOut" }}
		>
			{children}
		</motion.div>
	);
}
