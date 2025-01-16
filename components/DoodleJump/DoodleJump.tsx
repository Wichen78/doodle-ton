// components/DoodleJump/DoodleJump.tsx

'use client';

import React, { FC, useState } from 'react';
import Toggle from '@/components/DoodleJump/Toggle';
import GameCanvas from '@/components/DoodleJump/GameCanvas';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation.ts';

const DoodleJump: FC = () => {
	const [gameEnded, setGameEnded] = useState<boolean>(false);
	const { permission, orientation, requestAccess, revokeAccess } = useDeviceOrientation();

	const onToggle = (toggleState: boolean): void => {
		if (toggleState) {
			requestAccess();
		} else {
			revokeAccess();
		}
	};

	const onReplay = () => {
		setGameEnded(false);
	}

	return (
		<>
			<Toggle isChecked={ permission } onToggle={ onToggle } />
			<GameCanvas orientation={ orientation } gameEnded={gameEnded} setGameEndedAction={ setGameEnded } />
			{ gameEnded && (
				<button
					onClick={onReplay}
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-20 py-8 text-4xl rounded-2xl bg-gray-600">
					Replay
				</button>) }
		</>
	);
};

export default DoodleJump;
