// components/Loading/Loading.tsx

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import { GameState, InitialGameState, useGameStore } from '@/utils/game-mechanics';

interface LoadingProps {
	setCurrentViewAction: (view: string) => void;
	setIsInitializedAction: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Loading({ setCurrentViewAction, setIsInitializedAction }: LoadingProps) {
	const initializeState = useGameStore((state: GameState) => state.initializeState);
	const [isDataLoaded, setIsDataLoaded] = useState(false);
	const openTimestampRef = useRef(Date.now());
	const [isAppropriateDevice, setIsAppropriateDevice] = useState(true);

	const fetchOrCreateUser = useCallback(async () => {
		try {
			//let initData, telegramId, username, telegramName, startParam;
			let initData, telegramName, startParam;

			if (typeof window !== 'undefined') {
				const WebApp = (await import('@twa-dev/sdk')).default;
				WebApp.ready();
				initData = WebApp.initData;
				//telegramId = WebApp.initDataUnsafe.user?.id.toString();
				//username = WebApp.initDataUnsafe.user?.username || 'Unknown User';
				telegramName = WebApp.initDataUnsafe.user?.first_name || 'Unknown User';
				startParam = WebApp.initDataUnsafe.start_param;
			}

			const referrerTelegramId = startParam ? startParam.replace('kentId', '') : null;

			if (process.env.NEXT_PUBLIC_BYPASS_TELEGRAM_AUTH === 'true') {
				initData = 'temp';
			}
			const response = await fetch('/api/user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					telegramInitData: initData,
					referrerTelegramId,
				}),
			});
			if (!response.ok) {
				throw new Error('Failed to fetch or create user');
			}
			const userData = await response.json();

			// Check if initData and telegramName are defined
			if (!initData) {
				throw new Error('initData is undefined');
			}
			if (!telegramName) {
				throw new Error('telegramName is undefined');
			}

			// Create the game store with fetched data
			const initialState: InitialGameState = {
				userTelegramInitData: initData,
				userTelegramName: telegramName,
				points: userData.points,
			};

			initializeState(initialState);
			setIsDataLoaded(true);
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	}, [initializeState]);

	useEffect(() => {
		const parser: UAParser = new UAParser();
		const device = parser.getDevice();
		const isAppropriate = process.env.NEXT_PUBLIC_ALLOW_ALL_DEVICES === 'true' || device.type === 'mobile' || device.type === 'tablet';
		setIsAppropriateDevice(isAppropriate);

		if (isAppropriate) {
			fetchOrCreateUser();
		}
	}, []);

	useEffect(() => {
		if (isDataLoaded) {
			const currentTime = Date.now();
			const elapsedTime = currentTime - openTimestampRef.current;
			const remainingTime = Math.max(3000 - elapsedTime, 0);

			const timer = setTimeout(() => {
				setCurrentViewAction('game');
				setIsInitializedAction(true);
			}, remainingTime);

			return () => clearTimeout(timer);
		}
	}, [isDataLoaded, setIsInitializedAction, setCurrentViewAction]);

	if (!isAppropriateDevice) {
		return (
			<div className="w-full max-w-xl text-white flex flex-col items-center">
				<h1 className="text-2xl font-bold mb-4">Play on your mobile</h1>
			</div>
		);
	}

	return (
		<div className="w-full max-w-xl text-white flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-4">Loading Doodle Ton</h1>
		</div>
	);
}
