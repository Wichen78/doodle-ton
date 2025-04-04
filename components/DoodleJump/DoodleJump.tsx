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

	return (
		<div className="bg-gradient-to-b from-blue-500 to-blue-100">
			<GameCanvas orientation={ orientation } gameStatus={ gameStatus } setGameStatus={ setGameStatus } />
			<div className="absolute w-full h-full top-0 flex flex-col justify-between">
				<TopBar gameStatus={ gameStatus } onStop={ onStop } />
				{ gameStatus === GameStatus.ENDED && (
					<>
						<img src="/title.svg" alt="Astro Ton" className="max-h-48 max-w-[95%] mx-auto" />
						<div id="social"></div>
						<div>
							<PlanetCarousel onPlay={ onPlay } />
							<NextLevel />
						</div>
					</>
				) }
			</div>
		</div>
	);
};

export default DoodleJump;
