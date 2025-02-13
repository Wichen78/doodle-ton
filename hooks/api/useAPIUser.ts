// hooks/api/useAPIUser.ts

'use client';

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
			telegramInitData: params.telegramInitData,
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
		if (query.data && queryParams?.telegramInitData) {
			const initialState: InitialGameState = {
				userTelegramInitData: queryParams?.telegramInitData,
				userTelegramName: query.data.name,
				points: query.data.pointsBalance,
			};
			initializeState(initialState);
		}
	}, [query.data, queryParams?.telegramInitData]);

	const fetchUserTelegram = async () => {
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

			fetchUserWithParams({ telegramInitData: initData });
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	};

	const fetchUserWithParams = (params: GetUserQueryParams) => {
		setQueryParams(params);
		query.refetch();
	};

	return { fetchUserTelegram };
};
