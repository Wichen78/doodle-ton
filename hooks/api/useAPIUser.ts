// hooks/api/useAPIUser.ts

'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserResponse } from '@/types/api';
import { GET_USER, GET_USER_KEY } from '@/types/queryKey';
import { GetAttemptQueryParams, GetUserQueryParams } from '@/types/queryParams';
import { GameState, InitialGameState, useGameStore } from '@/utils/game-mechanics';

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

const fetchUserBalance = async (params: GetAttemptQueryParams): Promise<UserResponse> => {
	const response = await fetch(`/api/user/balance?telegramInitData=${ encodeURIComponent(params.telegramInitData) }`);
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
						stars: res.data.starsBalance,
						isCompleted: true,
					};
					initializeState(initialState);
				}
			});
		}
	}, [initDataKey]);

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

			if (!initData) {
				initializeState({ isCompleted: true });
			} else {
				setInitDataKey(initData);
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
			initializeState({ isCompleted: true });
		}
	};

	return { fetchUserTelegram };
};

export const useAPIUser = () => {
	const { userTelegramInitData } = useGameStore();

	const balance = useQuery({
		queryKey: GET_USER.BALANCE_KEY,
		queryFn: () => fetchUserBalance({ telegramInitData: userTelegramInitData }),
	});

	return { balance };
};
