"use client";
import React from "react";
import { NetworkProvider } from "./hooks/NetworkContext";
import Screen from "./screen";
import FadeIn from "./components/fadein";

const Page = () => {
	return (
		<NetworkProvider>
			<FadeIn>
				<Screen />
			</FadeIn>
		</NetworkProvider>
	);
};

export default Page;
