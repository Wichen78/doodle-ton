// components/DoodleJump/DoodleJump.tsx

'use client';

import React from 'react';
import Toggle from '@/components/DoodleJump/Toggle';
import GameCanvas from '@/components/DoodleJump/GameCanvas';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation.ts';

const DoodleJump: React.FC = () => {
	const { permission, orientation, requestAccess, revokeAccess } = useDeviceOrientation();

	const onToggle = (toggleState: boolean): void => {
		if (toggleState) {
			requestAccess();
		} else {
			revokeAccess();
		}
	};

	return (
		<>
			<Toggle isChecked={ permission } onToggle={ onToggle } />
			<GameCanvas orientation={ orientation } />
		</>
	);
};

export default DoodleJump;
