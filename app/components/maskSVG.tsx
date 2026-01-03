import { messages } from "../types/type";

// SVGマスクコンポーネント
export const MaskSVG: React.FC<{
	messages: messages["messages"];
}> = ({ messages }) => {
	return (
		<svg className='w-full h-full'>
			<mask id='mask-id'>
				<rect width='100%' height='100%' fill='white' />

				{messages.map((message, key) => {
					if (message.position.x < 0 || message.position.y < 0) {
						return;
					}

					const offsetPx = 20;
					const offsetY = offsetPx / window.innerHeight;

					const opacity = message.opacity;
					const x = Math.floor(message.position.x * 100).toString() + "%";
					const y =
						Math.floor((message.position.y + offsetY) * 100).toString() + "%";
					const fill = Math.floor((1 - opacity) * 255)
						.toString(16)
						.padStart(2, "0");

					return (
						<text
							key={key}
							x={x}
							y={y}
							textAnchor='start'
							fill={"#" + fill + fill + fill}
							fontSize='48'
							fontWeight='bold'
							fontFamily='"M PLUS Rounded 1c", sans-serif'
						>
							{message.content}
						</text>
					);
				})}
			</mask>
		</svg>
	);
};
