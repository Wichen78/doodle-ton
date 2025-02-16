// components/DoodleJump/DoodleJump.tsx

'use client';

import React, { FC, useEffect, useState } from 'react';
import GameCanvas from '@/components/DoodleJump/GameCanvas';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import { useAPIAttempt } from '@/hooks/api/useAPIAttempt';
import { useGame } from '@/contexts/GameContext';
import { useGameStore } from '@/utils/game-mechanics';

const DoodleJump: FC = () => {
	const { orientation, requestAccess } = useDeviceOrientation();
	const { userTelegramInitData } = useGameStore();
	const { score } = useGame();
	const { best, createAttempt } = useAPIAttempt();
	const [gameEnded, setGameEnded] = useState<boolean>(true);

	useEffect(() => {
		if (gameEnded && score >= 0) {
			createAttempt.mutate({ telegramInitData: userTelegramInitData, score });
		}
	}, [gameEnded]);

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
					{ !createAttempt.isPending && createAttempt.isSuccess &&
						<p className="text-2xl">Score: { createAttempt.data?.points }</p> }
					<button
						onClick={ onPlay }
						className="px-10 py-8 rounded-2xl bg-gray-600">
						<p className="text-4xl">{ score < 0 ? 'PLAY' : 'REPLAY' }</p>
					</button>
					{ !best.isPending && best.isSuccess && <p className="text-2xl">Best: { best.data?.points }</p> }
				</div>
			) }
		</>
	);
};

export default DoodleJump;
