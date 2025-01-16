// components/DoodleJump/GameCanvas.tsx

'use client'

import React, { useRef } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';

interface GameCanvasProps {
	orientation: DeviceOrientationEvent | null;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ orientation }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useGameLoop(canvasRef, orientation);

	return <canvas ref={ canvasRef } width={ 375 } height={ 667 } style={ { border: '1px solid black' } } />;
};

export default GameCanvas;
