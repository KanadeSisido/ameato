import { Transition } from "@headlessui/react";
import Image from "next/image";
import React, { useState } from "react";
import { mutate } from "swr/_internal";
import { JosefinSans } from "../fonts/font";
import { motion } from "motion/react";
import { NetWorkContext } from "../hooks/NetworkContext";

// ローディング表示コンポーネント + オフライン表示
export const RefreshTitle: React.FC<{
	isLoading: boolean;
	offline: boolean;
}> = ({ isLoading }) => {
	const { isOnline } = React.useContext(NetWorkContext);
	const [guard, setGuard] = useState(false);

	const handleClick = () => {
		// 連打対策
		if (guard || isLoading) return;
		setGuard(true);
		setTimeout(() => setGuard(false), 4000);

		mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/messages`);
	};

	return (
		<>
			<div className='fixed top-3 left-2 '>
				<Image
					onClick={handleClick}
					src='ameato.svg'
					alt='ame:ato'
					width={200}
					height={50}
					className='cursor-pointer select-none hover:opacity-70'
				/>

				{!isOnline && (
					<div className={"text-blue-200 mt-2 " + JosefinSans.className}>
						OFFLINE
					</div>
				)}
			</div>
			<Transition
				enter='transition-opacity duration-500'
				enterFrom='opacity-0'
				enterTo='opacity-100'
				leave='transition-opacity duration-500'
				leaveFrom='opacity-100'
				leaveTo='opacity-0'
				afterLeave={() => {}}
				show={(isLoading && isOnline) || guard}
			>
				<motion.p
					initial={{ y: 50, scale: 0.4 }}
					animate={{ y: 0, scale: 1 }}
					transition={{ duration: 0.2, ease: "easeOut" }}
					className={
						"fixed bottom-3 right-1/2 translate-x-1/2 text-white rounded-full backdrop-blur-2xl bg-white/20 px-6 py-4 text-md " +
						JosefinSans.className
					}
				>
					Loading...
				</motion.p>
			</Transition>
		</>
	);
};
