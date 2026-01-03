import { useEffect, useState } from "react";

export const useUnclickedWhile = (
	clickHandler: () => void,
	waitTime: number
) => {
	const [clicked, setClicked] = useState(false);
	const clickListener = () => {
		setClicked(true);
	};

	useEffect(() => {
		document.addEventListener("click", clickListener);

		const timer = setTimeout(() => {
			if (!clicked) {
				clickHandler();
			}
		}, waitTime);

		return () => {
			clearTimeout(timer);
			document.removeEventListener("click", clickListener);
		};
	}, [clicked]);
};
