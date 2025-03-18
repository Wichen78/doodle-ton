// components/DoodleJump/GameCanvas.tsx

'use client';

import { useRef } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { GameStatus } from '@/utils/game-mechanics';

interface GameCanvasProps {
	orientation: DeviceOrientationEvent | null;
	gameStatus: GameStatus;
	setGameStatus: (gameStatus: GameStatus) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ orientation, gameStatus, setGameStatus }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useGameLoop(canvasRef, orientation, gameStatus, setGameStatus);

	return (
		<canvas ref={ canvasRef } style={ { border: '1px solid black' } } />
	);
};

export default GameCanvas;
