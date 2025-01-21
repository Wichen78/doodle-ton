// components/DoodleJump/DoodleJump.tsx

'use client';

import React, { FC, useState } from 'react';
import GameCanvas from '@/components/DoodleJump/GameCanvas';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation.ts';
import { useGame } from '@/contexts/GameContext.tsx';

const DoodleJump: FC = () => {
	const [gameEnded, setGameEnded] = useState<boolean>(true);
	const { score } = useGame();
	const { orientation, requestAccess } = useDeviceOrientation();

	const onPlay = () => {
		requestAccess();
		setGameEnded(false);
	};

	return (
		<>
			{
				!gameEnded && (
					<p className="absolute inset-y-4 left-1/2 text-3xl">{ score }</p>
				)
			}
			<GameCanvas orientation={ orientation } gameEnded={ gameEnded } setGameEndedAction={ setGameEnded } />
			{ gameEnded && (
				<button
					onClick={ onPlay }
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-10 py-8 rounded-2xl bg-gray-600">
					<p className="text-2xl">Score: { score }</p>
					<p className="text-4xl">PLAY</p>
				</button>) }
		</>
	);
};

export default DoodleJump;
