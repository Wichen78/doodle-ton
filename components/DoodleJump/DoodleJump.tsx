// components/DoodleJump/DoodleJump.tsx

'use client';

import React, { FC, useEffect, useState } from 'react';

import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import { useAPIAttempt } from '@/hooks/api/useAPIAttempt';
import { useGame } from '@/hooks/useGame';
import { GameStatus, useGameStore } from '@/utils/game-mechanics';
import GameCanvas from '@/components/DoodleJump/GameCanvas';
import TopBar from '@/components/TopBar/TopBar';
import DashboardLayout from '@/components/DashboardLayout';
import PauseLayout from '@/components/PauseLayout/PauseLayout';
import SettingsLayout from '@/components/SettingsLayout';

const DoodleJump: FC = () => {
	const [openSettings, setOpenSettings] = useState<boolean>(false);
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
		<>
			<GameCanvas orientation={ orientation } gameStatus={ gameStatus } setGameStatus={ setGameStatus } />
			<div className="absolute w-full h-full top-0 flex flex-col justify-between">
				<TopBar gameStatus={ gameStatus } onStop={ onStop } blur={ gameStatus === GameStatus.PAUSED || openSettings }
								onSettings={ () => setOpenSettings(prev => !prev) } />
				{ gameStatus === GameStatus.ENDED && (
					openSettings ? (
						<SettingsLayout onClose={ () => setOpenSettings(false) } />
					) : (
						<DashboardLayout onPlay={ onPlay } />
					)
				) }
				{ gameStatus === GameStatus.PAUSED && (
					<PauseLayout onStop={ onStop } onExit={ onExit } />
				) }
			</div>
		</>
	);
};

export default DoodleJump;
