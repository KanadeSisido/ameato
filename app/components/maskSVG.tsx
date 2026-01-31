"use client";
import { useEffect, useState } from "react";
import { message, messages } from "../types/type";

export const MaskSVG: React.FC<{
	messages: messages;
}> = ({ messages }) => {
	const [isMounted, setIsMounted] = useState(false);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		setIsMounted(true);

		const updateDimensions = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);

		return () => {
			window.removeEventListener("resize", updateDimensions);
		};
	}, []);

	if (!isMounted || dimensions.width === 0) return null;

	return (
		<svg
			className='absolute top-0 left-0'
			width={dimensions.width}
			height={dimensions.height}
			viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
			style={{
				pointerEvents: "none",
				position: "absolute",
				top: 0,
				left: 0,
			}}
			xmlns='http://www.w3.org/2000/svg'
		>
			<defs>
				<mask
					id='mask-id'
					x='0'
					y='0'
					width={dimensions.width}
					height={dimensions.height}
				>
					<rect
						x='0'
						y='0'
						width={dimensions.width}
						height={dimensions.height}
						fill='white'
					/>

					{messages.map((message: message, key: number) => {
						if (message.position.x < 0 || message.position.y < 0) {
							return null;
						}

						const offsetPx = 20;
						const offsetY = offsetPx / dimensions.height;

						const opacity = message.opacity;
						const x = message.position.x * dimensions.width;
						const y = (message.position.y + offsetY) * dimensions.height;
						const grayValue = Math.floor((1 - opacity) * 255);
						const fill = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;

						return (
							<text
								key={key}
								x={x}
								y={y}
								textAnchor='start'
								fill={fill}
								fontSize='48'
								fontWeight='bold'
								fontFamily='"M PLUS Rounded 1c", sans-serif'
							>
								{message.content}
							</text>
						);
					})}
				</mask>
			</defs>
		</svg>
	);
};
