import { useEffect } from "react";

export const useKeyShortcuts = (
	isOpen: boolean,
	onClose: () => void,
	onSubmit: () => void
) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			} else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
				if (isOpen) {
					onSubmit();
				}
			}
		};
		if (typeof window !== "undefined") {
			document.addEventListener("keydown", handleKeyDown);
		}
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose, onSubmit]);
};
