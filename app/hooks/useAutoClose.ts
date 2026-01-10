import { useEffect, useState } from "react";

export const useAutoClose = (waitTime: number) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");

	// ダイアログを自動で閉じる
	useEffect(() => {
		if (!dialogOpen) return;

		const timer = setTimeout(() => {
			setDialogOpen(false);
		}, waitTime);
		return () => clearTimeout(timer);
	}, [dialogOpen, waitTime]);

	useEffect(() => {
		if (dialogOpen) return;
		if (dialogMessage === "") return;
		setDialogOpen(true);
	}, [dialogMessage]);

	return [dialogOpen, setDialogOpen, dialogMessage, setDialogMessage] as const;
};
