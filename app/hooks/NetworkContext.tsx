import React from "react";

const NetWorkContext = React.createContext<{ isOnline: boolean }>({
	isOnline: true,
});

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isOnline, setIsOnline] = React.useState<boolean>(
		typeof window !== "undefined" ? navigator.onLine : true
	);

	React.useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return (
		<NetWorkContext.Provider value={{ isOnline }}>
			{children}
		</NetWorkContext.Provider>
	);
};

export { NetWorkContext };
