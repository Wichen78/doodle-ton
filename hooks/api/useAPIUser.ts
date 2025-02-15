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
	const [initDataKey, setInitDataKey] = useState<string>('');
	const query = useQuery({
		queryKey: GET_USER_KEY.concat(initDataKey),
		queryFn: ({ queryKey }) => fetchUser({ telegramInitData: queryKey[1] }),
		enabled: false,
	});

	useEffect(() => {
		if (initDataKey) {
			query.refetch().then((res) => {
				if (res.isSuccess) {
					const initialState: InitialGameState = {
						userTelegramInitData: initDataKey,
						userTelegramName: res.data.name,
						points: res.data.pointsBalance,
					};
					initializeState(initialState);
				}
			});
		}
	}, [initDataKey]);

	const fetchUserTelegram = async () => {
		if (initDataKey !== '') return;
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

			setInitDataKey(initData);
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	};

	return { fetchUserTelegram };
};
