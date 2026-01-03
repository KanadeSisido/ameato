"use client";
import { Transition } from "@headlessui/react";
import React from "react";
import { motion } from "motion/react";
import { position, messages, createMessage } from "./types/type";
import { useCreateMessage, useMessages } from "./hooks/useMessage";
import { JosefinSans, MPLUSRounded1c } from "./fonts/font";
import Link from "next/link";
import { useKeyShortcuts } from "./hooks/useKeyShortcuts";
import { RefreshTitle } from "./components/refreshTitle";
import { MaskSVG } from "./components/maskSVG";
import { useAutoClose } from "./hooks/useAutoClose";
import { useUnclickedWhile } from "./hooks/useTips";

export default function Home() {
	const [inputPos, setInputPos] = React.useState<position>({ x: 0, y: 0 });
	const [isOpen, setIsOpen] = React.useState(false);
	const [inputText, setInputText] = React.useState("");
	const [dialogMessage, setDialogMessage] = React.useState("");
	const [previousIsError, setPreviousIsError] = React.useState<boolean>(false);
	const [additionalMessages, setAdditionalMessages] = React.useState<
		messages["messages"]
	>([]);
	const [unSyncedMessages, setUnSyncedMessages] = React.useState<
		messages["messages"]
	>([]);
	const [openTips, setOpenTips] = React.useState(false);

	// 自動で閉じるダイアログ
	const [dialogOpen, setDialogOpen] = useAutoClose(4000);

	// キーショートカット
	useKeyShortcuts(
		isOpen,
		() => setIsOpen(false),
		() => handleSubmit()
	);

	// メッセージ取得
	let { messages, isLoading, isError } = useMessages({
		onSuccess: () => setAdditionalMessages([]),
	});

	useUnclickedWhile(() => {
		setOpenTips(true);
	}, 6000);

	// オンライン・オフライン検知
	React.useEffect(() => {
		if (isError && !previousIsError) {
			setDialogMessage("オフラインです");
			setDialogOpen(true);
			setPreviousIsError(true);
		}
		if (!isError && previousIsError) {
			setDialogMessage("オンラインに復帰しました");
			setDialogOpen(true);
			setPreviousIsError(false);

			if (unSyncedMessages.length == 0) {
				return;
			}

			unSyncedMessages.forEach(async (msg) => {
				const createMsg: createMessage = {
					position: msg.position,
					content: msg.content,
				};

				const status = await useCreateMessage().createMessage(createMsg);

				if (status !== 201) {
					setDialogMessage("Failed to sync messages");
					setDialogOpen(true);
				}
			});

			setAdditionalMessages([...additionalMessages, ...unSyncedMessages]);
			setUnSyncedMessages([]);
		}
	}, [isError]);

	// クリックした位置に入力フォームを表示
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setIsOpen(true);
		setOpenTips(false);

		const rect = event.currentTarget.getBoundingClientRect();

		const boxWidth = 400;
		const viewportWidth = window.innerWidth;
		let inputX = event.clientX + window.scrollX;
		let inputY = event.clientY + window.scrollY;

		if (event.clientX + boxWidth > viewportWidth) {
			const targetX = inputX - (viewportWidth - boxWidth) / 2 - 20;

			// DOMとの競合を避けるためにsetTimeoutで遅延させる
			// useEffectで遅延させてもいいけど、ゴチャ付くのでここで完結させる
			setTimeout(() => {
				window.scrollTo({ top: 0, left: targetX, behavior: "smooth" });
			}, 0);
		}

		// 左右余白を確保
		if (inputX > rect.width - 400) {
			inputX = rect.width - 400;
		} else if (inputX < 40) {
			inputX = 40;
		}

		// 上下部余白を確保
		if (inputY > rect.height - 100) {
			inputY = rect.height - 100;
		} else if (inputY < 70) {
			inputY = 70;
		}

		const x = inputX / rect.width;
		const y = inputY / rect.height;

		setInputPos({ x: x, y: y });
	};

	const isDisabled = inputText.length === 0 || inputText.length > 30;
	const submitMessage = useCreateMessage();

	const handleSubmit = async () => {
		// 条件に合致しない場合は送信しない
		if (isDisabled) {
			return;
		}
		if (!isOpen) {
			return;
		}
		if (inputText.length === 0 || inputText.length > 30) {
			return;
		}
		if (
			inputPos.x <= 0 ||
			inputPos.y <= 0 ||
			inputPos.x >= 1 ||
			inputPos.y >= 1
		) {
			return;
		}

		// 送信するメッセージ
		const newMessage: createMessage = {
			position: inputPos,
			content: inputText,
		};

		// 送信
		const status = await submitMessage.createMessage(newMessage);
		setIsOpen(false);
		setInputText("");

		if (status === 201) {
			setDialogMessage("Drawn Successfully");
			setDialogOpen(true);
			// 送信成功したらバックエンドに問い合わせせずに画面に反映
			setAdditionalMessages([
				...additionalMessages,
				{
					position: inputPos,
					content: inputText,
					opacity: 1.0,
				},
			]);
		} else {
			setDialogMessage("オンライン復帰後に反映されます");
			setDialogOpen(true);
			// オフライン時はUnSyncedMessagesに追加
			setUnSyncedMessages([
				...unSyncedMessages,
				{
					position: inputPos,
					content: inputText,
					opacity: 1.0,
				},
			]);
		}
	};

	return (
		<div className='relative w-full h-svh min-w-7xl bg-black'>
			<video
				src='/bg.mp4'
				autoPlay
				loop
				muted
				playsInline
				className='absolute w-full h-full object-cover'
			/>

			<div
				className='absolute w-full h-full backdrop-blur-sm bg-white/30'
				style={{ maskImage: "url(#mask-id)" }}
				onClick={handleClick}
			></div>

			<MaskSVG
				messages={[...messages, ...additionalMessages, ...unSyncedMessages]}
			/>

			<Transition
				show={isOpen}
				enter='transition-opacity duration-500'
				enterFrom='opacity-0'
				enterTo='opacity-100'
				leave='transition-opacity duration-500'
				leaveFrom='opacity-100'
				leaveTo='opacity-0'
			>
				<div
					className='bg-black/40 absolute top-0 left-0 w-full h-full'
					onClick={() => setIsOpen(false)}
				/>
			</Transition>
			<Transition
				show={isOpen}
				enter='transition-opacity duration-500'
				enterFrom='opacity-0'
				enterTo='opacity-100'
				leave='transition-opacity duration-500'
				leaveFrom='opacity-100'
				leaveTo='opacity-0'
				afterLeave={() => setInputPos({ x: 0, y: 0 })}
			>
				<div
					className='absolute flex flex-col'
					style={{
						left: `calc(${Math.floor(inputPos.x * 100).toString()}% - 20px)`,
						top: `calc(${Math.floor(inputPos.y * 100).toString()}% - 60px)`,
					}}
				>
					<p
						className={
							"font-bold " +
							(inputText.length > 30 ? "text-red-500" : "text-white")
						}
					>
						{inputText.length} / 30
					</p>
					<motion.input
						initial={{ scale: 0.5 }}
						animate={{ scale: 1 }}
						transition={{
							duration: 0.25,
							ease: "easeOut",
						}}
						type='text'
						onChange={(e) => setInputText(e.target.value)}
						value={inputText}
						className={
							"bg-white/40 border-none outline-0 rounded-full h-20 w-100 px-6 text-5xl text-white font-bold " +
							MPLUSRounded1c.className
						}
						autoFocus
					></motion.input>
					<motion.button
						initial={{ scale: 0.1 }}
						animate={{ scale: 1 }}
						transition={{
							duration: 0.25,
							ease: "easeOut",
						}}
						onClick={handleSubmit}
						whileHover={{ scale: isDisabled ? 1 : 1.05 }}
						whileTap={{ scale: isDisabled ? 1 : 0.95 }}
						disabled={isDisabled}
						className={
							"block rounded-full h-14 w-40 px-4 mt-2 pt-2 text-3xl text-center self-end " +
							JosefinSans.className +
							(isDisabled
								? " bg-gray-300/40 text-gray-300"
								: " bg-emerald-300/70 text-white")
						}
					>
						Draw
					</motion.button>
				</div>
			</Transition>

			<Transition
				show={dialogOpen}
				enter='transition-opacity duration-500'
				enterFrom='opacity-0'
				enterTo='opacity-100'
				leave='transition-opacity duration-500'
				leaveFrom='opacity-100'
				leaveTo='opacity-0'
				afterLeave={() => {}}
			>
				<motion.div
					initial={{ y: 50, scale: 0.4 }}
					animate={{ y: 0, scale: 1 }}
					transition={{ duration: 0.2, ease: "easeOut" }}
					className='fixed bottom-3 right-2 text-white rounded backdrop-blur-2xl bg-white/20 px-6 py-4 max-w-sm truncate text-sm cursor-pointer'
					onClick={() => {
						setDialogOpen(false);
					}}
				>
					<h1 className={"text-sm sm:text-xl " + JosefinSans.className}>
						{dialogMessage}
					</h1>
				</motion.div>
			</Transition>

			<RefreshTitle isLoading={isLoading} offline={previousIsError} />
			<Link href='/about'>
				<p
					className={
						"fixed bottom-3 left-2 text-white rounded backdrop-blur-2xl bg-white/20 px-4 py-2 text-sm cursor-pointer hover:underline " +
						JosefinSans.className
					}
				>
					About / Terms
				</p>
			</Link>
			<Transition
				show={openTips}
				enter='transition-opacity duration-500 delay-1000'
				enterFrom='opacity-0'
				enterTo='opacity-100'
				leave='transition-opacity duration-500'
				leaveFrom='opacity-100'
				leaveTo='opacity-0'
			>
				<motion.p
					initial={{ y: -40 }}
					animate={{ y: 0 }}
					transition={{ duration: 0.2, ease: "easeOut", delay: 1.0 }}
					className={
						"fixed bottom-3 right-2 md:top-2 text-right max-w-1/2 text-white drop-shadow-md drop-shadow-white/30 cursor-pointer " +
						MPLUSRounded1c.className
					}
					onClick={() => {
						setOpenTips(false);
					}}
				>
					メッセージを描くには画面をタップしてください
				</motion.p>
			</Transition>
		</div>
	);
}
