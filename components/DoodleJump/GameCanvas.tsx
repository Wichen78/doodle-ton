// components/DoodleJump/GameCanvas.tsx

'use client';

import React, { useRef } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';

interface GameCanvasProps {
	orientation: DeviceOrientationEvent | null;
	gameEnded: boolean;
	setGameEndedAction: (gameEnded: boolean) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ orientation, gameEnded, setGameEndedAction }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useGameLoop(canvasRef, orientation, gameEnded, setGameEndedAction);

	return (
		<canvas ref={ canvasRef } width={ 375 } height={ 600 } style={ { border: '1px solid black' } } />
	);
};

export default GameCanvas;
