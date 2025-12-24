// components/DoodleJump/DoodleJump.tsx

'use client';

import { FC, useEffect, useState } from 'react';

import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import { useAPIAttempt } from '@/hooks/api/useAPIAttempt';
import { useGame } from '@/hooks/useGame';
import { GameStatus, useGameStore } from '@/utils/game-mechanics';
import GameCanvas from '@/components/DoodleJump/GameCanvas';
import TopBar from '@/components/TopBar/TopBar';
import DashboardLayout from '@/components/DashboardLayout';
import PauseLayout from '@/components/PauseLayout/PauseLayout';
import SettingsLayout from '@/components/SettingsLayout';

/**
 * Represents the DoodleJump game component.
 *
 * This component manages the core game logic, including game state transitions, user interactions,
 * and integration with external APIs for attempts and scoring. It provides a UI layout with game
 * elements such as a game canvas, top bar, pause menu, settings menu, and dashboard.
 *
 * Visual Components:
 * - `GameCanvas`: The primary game screen that renders game graphics and handles gameplay.
 * - `TopBar`: Displays game controls and settings toggle with optional blur during pause/settings.
 * - `PauseLayout`: Displays the pause menu with options to resume or exit the game.
 * - `SettingsLayout`: Displays configurable game or app settings.
 * - `DashboardLayout`: Shown when the game ends, providing an option to start a new game.
 */
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
