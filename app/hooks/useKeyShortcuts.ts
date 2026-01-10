import { useEffect } from "react";

export const useKeyShortcuts = (
	keymap: {
		[key: string]: (e: KeyboardEvent) => void;
	},
	requireControll?: {
		[key: string]: (e: KeyboardEvent) => void;
	}
) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const action = keymap[e.key];

			if (action && !e.ctrlKey) {
				e.preventDefault();
				action(e);
			}
			if (e.ctrlKey) {
				const ctrlAction = requireControll?.[e.key];

				if (ctrlAction) {
					e.preventDefault();
					ctrlAction(e);
				}
			}
		};
		if (typeof window !== "undefined") {
			document.addEventListener("keydown", handleKeyDown);
		}
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [keymap, requireControll]);
};
