import useSWR from "swr";
import {
	messages,
	createMessageResponse,
	message,
	createMessage,
	messagesDto,
} from "../types/type";

const fetcher: (url: string) => Promise<messages> = async (url: string) => {
	const response = await fetch(url);

	if (!response.ok) {
		const error = new Error("An error occurred while fetching the data.");
		throw error;
	}

	const json: messagesDto = await response.json();
	return json.messages;
};

type OptimisticMessage = message & { id: `opt-${string}` };
type ClientMessage = message | OptimisticMessage;
type ClientMessages = ClientMessage[];

// メッセージ取得＋Revalidate時にコールバックを実行
export const useMessages = (isOnline: boolean) => {
	// 1分ごとにデータを再取得
	const { data, error, isLoading, mutate } = useSWR<ClientMessages>(
		`${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
		fetcher,
		{
			refreshInterval: isOnline ? 60000 : 0,
			revalidateOnReconnect: true,
			keepPreviousData: true,
		}
	);

	const addMessage = async (content: createMessage) => {
		const id: `opt-${string}` = `opt-${Date.now()}`;

		const optimisticMessage: OptimisticMessage = {
			...content,
			opacity: 1.0,
			id,
		};

		try {
			await mutate(
				async (current) => {
					const prevMessages = current || [];
					const createdMessage = await postMessage(content);

					if (!createdMessage) {
						return prevMessages.filter(
							(msg) => !("id" in msg) || msg.id !== id
						);
					}

					return [
						...prevMessages.filter((msg) => !("id" in msg) || msg.id !== id),
						createdMessage,
					];
				},

				{
					optimisticData: [...(data ?? []), optimisticMessage],
					rollbackOnError: true,
					revalidate: false,
					// エラーを明示的に発生させる
					throwOnError: true,
				}
			);
		} catch (error) {
			// エラーを呼び出し側に伝播させる
			throw error;
		}
	};

	return {
		messages: data ? data : [],
		isLoading,
		isError: error,
		addMessage,
	};
};

export class StatusError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "StatusError";
	}
}

export class DataError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DataError";
	}
}

export class OfflineError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "OfflineError";
	}
}

const postMessage: (content: createMessage) => Promise<message> = async (
	content: createMessage
) => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(content),
			}
		);

		if (!response.ok) {
			throw new StatusError("Status Error");
		}

		try {
			const data: createMessageResponse = await response.json();
			return data.message;
		} catch (_error) {
			throw new DataError("Invalid response data");
		}
	} catch (error) {
		if (error instanceof StatusError) {
			throw error;
		}
		if (error instanceof DataError) {
			throw error;
		}
		// ネットワークエラーなど
		throw new OfflineError("Network Error");
	}
};
