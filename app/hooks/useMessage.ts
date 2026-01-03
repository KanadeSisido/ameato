import useSWR from "swr";
import { createMessage, messages } from "../types/type";

const fetcher = async (url: string) => {
	const response = await fetch(url);

	if (!response.ok) {
		const error = new Error("An error occurred while fetching the data.");
		throw error;
	}
	return response.json();
};

// メッセージ取得＋Revalidate時にコールバックを実行
export const useMessages = ({
	onSuccess,
}: {
	onSuccess?: (data: messages) => void;
}) => {
	// 1分ごとにデータを再取得
	const { data, error, isLoading } = useSWR<messages>(
		`${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
		fetcher,
		{
			refreshInterval: 60000,
			onSuccess: (data) => {
				if (onSuccess) {
					onSuccess(data);
				}
			},
		}
	);
	return {
		messages: data ? data.messages : [],
		isLoading,
		isError: error,
	};
};

export const useCreateMessage = () => {
	const createMessage = async (content: createMessage) => {
		let response;
		try {
			response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(content),
				}
			);
		} catch (error) {
			return 400;
		} finally {
			return response ? response.status : 400;
		}
	};
	return { createMessage };
};
