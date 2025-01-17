// components/DoodleJump/DoodleJump.tsx

'use client';

import React, { FC, useState } from 'react';
import GameCanvas from '@/components/DoodleJump/GameCanvas';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation.ts';

const DoodleJump: FC = () => {
	const [gameEnded, setGameEnded] = useState<boolean>(true);
	const { orientation, requestAccess } = useDeviceOrientation();

	const onPlay = () => {
		requestAccess();
		setGameEnded(false);
	};

	return (
		<>
			<GameCanvas orientation={ orientation } gameEnded={ gameEnded } setGameEndedAction={ setGameEnded } />
			{ gameEnded && (
				<button
					onClick={ onPlay }
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-20 py-8 text-4xl rounded-2xl bg-gray-600">
					<p>PLAY</p>
				</button>) }
		</>
	);
};

export default DoodleJump;
