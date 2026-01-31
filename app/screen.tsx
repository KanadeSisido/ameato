"use client";
import { Transition } from "@headlessui/react";
import React, { Suspense } from "react";
import { motion } from "motion/react";
import { position, messages, createMessage } from "./types/type";
import { OfflineError, useMessages } from "./hooks/useMessage";
import { JosefinSans, MPLUSRounded1c } from "./fonts/font";
import Link from "next/link";
import { useKeyShortcuts } from "./hooks/useKeyShortcuts";
import { RefreshTitle } from "./components/refreshTitle";
import { MaskSVG } from "./components/maskSVG";
import { useAutoClose } from "./hooks/useAutoClose";
import { useUnclickedWhile } from "./hooks/useTips";
import GitHubIconTips from "./components/gitHubIcon";
import { NetWorkContext } from "./hooks/NetworkContext";

export default function Screen() {
	const [clickPos, setClickPos] = React.useState<position>({ x: 0, y: 0 });
	const [isInputModalOpen, setIsInputModalOpen] = React.useState(false);
	const [openTips, setOpenTips] = React.useState(false);
	const [inputText, setInputText] = React.useState("");
	const [unSyncedMessages, setUnSyncedMessages] = React.useState<messages>([]);
	const [requireCtrlEnter, setRequireCtrlEnter] = React.useState(false);
	const { isOnline } = React.useContext(NetWorkContext);
	const [prevOnline, setPrevOnline] = React.useState(isOnline);

	// 自動で閉じるダイアログ
	const [dialogOpen, setDialogOpen, dialogMessage, setDialogMessage] =
		useAutoClose(4000);

	// Tips表示
	useUnclickedWhile(() => {
		setOpenTips(true);
	}, 6000);

	// キーショートカット
	useKeyShortcuts(
		// 通常アクション
		{
			Escape: (_: KeyboardEvent) => {
				setIsInputModalOpen(false);
			},
			Enter: (e: KeyboardEvent) => {
				if (!isInputModalOpen) {
					return;
				}
				if (!requireCtrlEnter) {
					e.preventDefault();
					handleSubmit();
					setRequireCtrlEnter(false);
				}
			},
		},
		// Ctrlキーアクション
		{
			Enter: (e: KeyboardEvent) => {
				if (!isInputModalOpen) {
					return;
				}
				if (requireCtrlEnter) {
					e.preventDefault();
					handleSubmit();
					setRequireCtrlEnter(false);
				}
			},
		},
	);

	// メッセージ取得
	const { messages, isLoading, isError, addMessage } = useMessages(isOnline);

	// オンライン・オフライン検知
	React.useEffect(() => {
		if (!prevOnline && isOnline) {
			setDialogMessage("オンラインに復帰しました");

			if (unSyncedMessages.length == 0) {
				return;
			}

			unSyncedMessages.forEach(async (msg) => {
				const createMsg: createMessage = {
					position: msg.position,
					content: msg.content,
				};

				try {
					// TODO: N+1問題になってるので、一括送信APIを作る
					await addMessage(createMsg);
				} catch (_error) {
					setDialogMessage("Failed to sync messages");
				}
			});

			setUnSyncedMessages([]);
		} else if (isError || !isOnline) {
			setDialogMessage("オフラインです");
			setPrevOnline(isOnline);
		}
	}, [isError, isOnline]);

	// クリックした位置に入力フォームを表示
	const handleClick = React.useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			setIsInputModalOpen(true);
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

			setClickPos({ x: x, y: y });
		},
		[],
	);

	const isDisabled = inputText.length === 0 || inputText.length > 30;

	const handleSubmit = React.useCallback(async () => {
		// 条件に合致しない場合は送信しない
		if (isDisabled) {
			return;
		}
		if (!isInputModalOpen) {
			return;
		}
		if (inputText.length === 0 || inputText.length > 30) {
			return;
		}
		if (
			clickPos.x <= 0 ||
			clickPos.y <= 0 ||
			clickPos.x >= 1 ||
			clickPos.y >= 1
		) {
			return;
		}

		// 送信するメッセージ
		const newMessage: createMessage = {
			position: clickPos,
			content: inputText,
		};

		// 送信
		try {
			// オフラインの場合はエラーを投げる
			if (!isOnline) {
				throw new OfflineError("Offline");
			}

			await addMessage(newMessage);
			setDialogMessage("Drawn Successfully");
		} catch (_error) {
			// 送信失敗（サーバ側エラー）の場合はオフライン扱いにする
			setDialogMessage("オンライン復帰後に反映されます");

			setUnSyncedMessages([
				...unSyncedMessages,
				{
					position: clickPos,
					content: inputText,
					opacity: 1.0,
				},
			]);
		} finally {
			setIsInputModalOpen(false);
			setInputText("");
		}
	}, [
		isDisabled,
		isInputModalOpen,
		inputText,
		clickPos,
		isOnline,
		addMessage,
		unSyncedMessages,
	]);

	const isHalfWidthText = React.useCallback((text: string): boolean => {
		// 半角英数字 [0-9,a-z,A-Z]
		// 半角記号 [\x20-\x7E]
		const regex = /^[\x20-\x7E]*$/;
		return regex.test(text);
	}, []);

	const handleChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			// 文字の末尾が半角英数字、記号のときはEnterキーのみで送信
			const lastChar = event.target.value.slice(-1);

			if (isHalfWidthText(lastChar)) {
				setRequireCtrlEnter(false);
			} else {
				setRequireCtrlEnter(true);
			}
			setInputText(event.target.value);
		},
		[isHalfWidthText],
	);

	return (
		<div className='relative w-full h-svh min-w-7xl bg-black'>
			<Suspense
				fallback={<div className='absolute w-full h-full bg-[#9DAEB9]'></div>}
			>
				<video
					src='/bg.mp4'
					autoPlay
					loop
					muted
					playsInline
					className='absolute w-full h-full object-cover'
				/>
			</Suspense>
			<div
				className='absolute w-full h-full backdrop-blur-sm bg-white/30'
				style={{
					WebkitMaskImage: "url(#mask-id)",
					maskImage: "url(#mask-id)",
					transform: "translateZ(0)",
					WebkitTransform: "translateZ(0)",
				}}
				onClick={handleClick}
			></div>

			<MaskSVG messages={[...messages, ...unSyncedMessages]} />

			<Transition
				show={isInputModalOpen}
				enter='transition-opacity duration-500'
				enterFrom='opacity-0'
				enterTo='opacity-100'
				leave='transition-opacity duration-500'
				leaveFrom='opacity-100'
				leaveTo='opacity-0'
			>
				<div
					className='bg-black/40 absolute top-0 left-0 w-full h-full'
					onClick={() => setIsInputModalOpen(false)}
				/>
			</Transition>
			<Transition
				show={isInputModalOpen}
				enter='transition-opacity duration-500'
				enterFrom='opacity-0'
				enterTo='opacity-100'
				leave='transition-opacity duration-500'
				leaveFrom='opacity-100'
				leaveTo='opacity-0'
				afterLeave={() => setClickPos({ x: 0, y: 0 })}
			>
				<div
					className='absolute flex flex-col'
					style={{
						left: `calc(${Math.floor(clickPos.x * 100).toString()}% - 20px)`,
						top: `calc(${Math.floor(clickPos.y * 100).toString()}% - 60px)`,
					}}
				>
					<div className='flex flex-row justify-between mb-2 px-2'>
						<p
							className={
								"font-bold " +
								(inputText.length > 30 ? "text-red-500" : "text-white")
							}
						>
							{inputText.length} / 30
						</p>
						<p
							className={
								"text-sm font-bold " +
								(requireCtrlEnter ? "text-green-300/70" : "text-white/70")
							}
						>
							{requireCtrlEnter ? "Ctrl+Enterで送信" : "Enterで送信"}
						</p>
					</div>
					<motion.input
						initial={{ scale: 0.5 }}
						animate={{ scale: 1 }}
						transition={{
							duration: 0.25,
							ease: "easeOut",
						}}
						type='text'
						onChange={handleChange}
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

			<RefreshTitle isLoading={isLoading} offline={!isOnline} />

			<div className='fixed bottom-3 left-2 flex flex-row items-center gap-4'>
				<Link
					href='https://github.com/KanadeSisido/ameato'
					target='_blank'
					rel='noopener noreferrer'
					className='w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer p-2'
				>
					<GitHubIconTips />
				</Link>
				<Link href='/about'>
					<p
						className={
							"text-white rounded backdrop-blur-2xl bg-white/20 hover:bg-white/30 px-4 py-2 text-sm cursor-pointer hover:underline " +
							JosefinSans.className
						}
					>
						About / Terms
					</p>
				</Link>
			</div>
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
