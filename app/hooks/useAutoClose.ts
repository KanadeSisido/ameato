import { useEffect, useState } from "react";

export const useAutoClose = (waitTime: number) => {
	const [dialogOpen, setDialogOpen] = useState(false);

	// ダイアログを自動で閉じる
	useEffect(() => {
		// early returnすれば無限ループを回避できる
		if (!dialogOpen) return;

		const timer = setTimeout(() => {
			setDialogOpen(false);
		}, waitTime);
		return () => clearTimeout(timer);
	}, [dialogOpen]);

	return [dialogOpen, setDialogOpen] as const;
};
