// components/DoodleJump/DoodleJump.tsx

'use client';

import React, { FC, useEffect, useState } from 'react';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import { useAPIAttempt } from '@/hooks/api/useAPIAttempt';
import { useGame } from '@/hooks/useGame';
import { GameStatus, useGameStore } from '@/utils/game-mechanics';
import GameCanvas from '@/components/DoodleJump/GameCanvas';
import TopBar from '@/components/TopBar/TopBar';
import PlanetCarousel from '@/components/PlanetCarousel/PlanetCarousel';
import NextLevel from '@/components/PlanetCarousel/NextLevel';

const DoodleJump: FC = () => {
	const { orientation, requestAccess } = useDeviceOrientation();
	const { userTelegramInitData } = useGameStore();
	const { score, starScore, resetGame } = useGame();
	const { createAttempt } = useAPIAttempt();
	const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.ENDED);

	useEffect(() => {
		if (gameStatus === GameStatus.ENDED && score >= 0) {
			createAttempt.mutate({ telegramInitData: userTelegramInitData, score, starScore });
		}
	}, [gameStatus]);

	const onStop = () => {
		if (gameStatus === GameStatus.PAUSED) {
			setGameStatus(GameStatus.RUNNING);
		} else if (gameStatus === GameStatus.RUNNING) {
			setGameStatus(GameStatus.PAUSED);
		}
	};

	const onPlay = () => {
		requestAccess();
		resetGame();
		setGameStatus(GameStatus.RUNNING);
	};

	const onExit = () => {
		resetGame();
		setGameStatus(GameStatus.ENDED);
	};

	return (
		<div className="bg-gradient-to-b from-blue-500 to-blue-100">
			<GameCanvas orientation={ orientation } gameStatus={ gameStatus } setGameStatus={ setGameStatus } />
			<div className="absolute w-full h-full top-0 flex flex-col justify-between">
				<TopBar gameStatus={ gameStatus } onStop={ onStop } />
				{ gameStatus === GameStatus.ENDED && (
					<>
						<img src="/title.svg" alt="Astro Ton" className="max-h-48 max-w-[95%] mx-auto" />
						<div>
							<PlanetCarousel onPlay={ onPlay } />
							<NextLevel />
						</div>
					</>
				) }
				{ gameStatus === GameStatus.PAUSED && (
					<div className="flex-1 flex items-center justify-center bg-blue-400/90">
						<div className="flex flex-col space-y-2">
							<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
											onClick={ onStop }>
								Resume
							</button>
							<button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl"
											onClick={ onExit }>
								Exit
							</button>
						</div>
					</div>
				) }
			</div>
		</div>
	);
};

export default DoodleJump;
