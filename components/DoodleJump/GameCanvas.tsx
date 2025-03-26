// components/DoodleJump/GameCanvas.tsx

'use client';

import { FC, useRef } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { GameStatus } from '@/utils/game-mechanics';

interface GameCanvasProps {
	gameStatus: GameStatus;
	setGameStatus: (gameStatus: GameStatus) => void;
}

const GameCanvas: FC<GameCanvasProps> = ({ gameStatus, setGameStatus }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useGameLoop(canvasRef, gameStatus, setGameStatus);

	return (
		<canvas ref={ canvasRef } style={ { border: '1px solid black' } } />
	);
};

export default GameCanvas;
