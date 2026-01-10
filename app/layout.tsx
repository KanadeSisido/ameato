import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export const metadata: Metadata = {
	title: "ame:ato | draw your condensed messages.",
	description: "ame:ato - 雨の日の窓みたいなSNSアプリケーション",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='jp' className='scrollbar-hidden'>
			<head>
				<meta name='referrer' content='strict-origin-when-cross-origin' />
			</head>
			<body className='antialiased bg-gray-800'>{children}</body>
		</html>
	);
}
