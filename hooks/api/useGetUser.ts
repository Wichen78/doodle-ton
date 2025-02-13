// hooks/api/useGetUser.ts

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserResponse } from '@/types/api';
import { GET_USER_KEY } from '@/types/queryKey';
import { GetUserQueryParams } from '@/types/queryParams';
import { GameState, InitialGameState, useGameStore } from '@/utils/game-mechanics.ts';

const fetchUser = async (params: GetUserQueryParams): Promise<UserResponse> => {
	const response = await fetch('/api/user', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			telegramInitData: params.initData,
		}),
	});
	return response.json();
};

export const useLazyGetUser = () => {
	const initializeState = useGameStore((state: GameState) => state.initializeState);
	const [queryParams, setQueryParams] = useState<GetUserQueryParams | null>(null);
	const query = useQuery({
		queryKey: GET_USER_KEY,
		queryFn: () => queryParams && fetchUser(queryParams),
		enabled: false,
	});

	useEffect(() => {
		if (query.data && queryParams?.initData) {
			const initialState: InitialGameState = {
				userTelegramInitData: queryParams?.initData,
				userTelegramName: query.data.name,
				points: query.data.pointsBalance,
			};
			initializeState(initialState);
		}
	}, [initializeState, query.data, queryParams?.initData]);

	const fetchTGUser = async () => {
		try {
			let initData: string | null = null;

			if (typeof window !== 'undefined') {
				const WebApp = (await import('@twa-dev/sdk')).default;
				WebApp.ready();
				initData = WebApp.initData;
			}

			if (process.env.NEXT_PUBLIC_BYPASS_TELEGRAM_AUTH === 'true') {
				initData = 'temp';
			}

			if (!initData) return;

			fetchUserWithParams({ initData });
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	};

	const fetchUserWithParams = (params: GetUserQueryParams) => {
		setQueryParams(params);
		query.refetch();
	};

	return { ...query, initData: queryParams?.initData, fetchTGUser };
};
