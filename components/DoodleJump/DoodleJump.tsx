// components/DoodleJump/DoodleJump.tsx

'use client';

import React, { FC, useCallback, useEffect, useState } from 'react';
import GameCanvas from '@/components/DoodleJump/GameCanvas';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation.ts';
import { useGame } from '@/contexts/GameContext.tsx';
import { useGameStore } from '@/utils/game-mechanics.ts';
import { AttemptCreateResponse } from '@/types/api.ts';

const DoodleJump: FC = () => {
	const { userTelegramInitData } = useGameStore();
	const [gameEnded, setGameEnded] = useState<boolean>(true);
	const { orientation, requestAccess } = useDeviceOrientation();
	const { score, resetScore } = useGame();
	const [attemptData, setAttemptData] = useState<AttemptCreateResponse | null>(null);

	const sendAttempt = useCallback(async (currentScore: number) => {
		try {
			const response = await fetch('/api/attempt/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					telegramInitData: userTelegramInitData,
					score: currentScore,
				}),
			});
			if (!response.ok) {
				throw new Error('Failed to create attempt');
			}
			const result: AttemptCreateResponse = await response.json();
			setAttemptData(result);
			resetScore();
		} catch (error) {
			console.error('Failed to create attempt', error);
		}
	}, [userTelegramInitData, resetScore]);

	useEffect(() => {
		if (gameEnded && score > 0) {
			sendAttempt(score);
		}
	}, [gameEnded, score, sendAttempt]);


	const onPlay = () => {
		requestAccess();
		setGameEnded(false);
	};

	return (
		<>
			{
				!gameEnded && (
					<p className="absolute inset-y-4 left-1/2 -translate-x-1/2 text-3xl">{ score }</p>
				)
			}
			<GameCanvas orientation={ orientation } gameEnded={ gameEnded } setGameEndedAction={ setGameEnded } />
			{ gameEnded && (
				<div
					className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
					{ attemptData && <p className="text-2xl">Score: { attemptData.current?.points }</p> }
					<button
						onClick={ onPlay }
						className="px-10 py-8 rounded-2xl bg-gray-600">
						<p className="text-4xl">PLAY</p>
					</button>
					{ attemptData && <p className="text-2xl">Best: { attemptData.best?.points }</p> }
				</div>
			) }
		</>
	);
};

export default DoodleJump;
