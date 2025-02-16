// components/Game/Game.tsx

'use client';

import { FC } from 'react';
import { NavigationProps } from '@/types';
import DoodleJump from '@/components/DoodleJump/DoodleJump';

const Game: FC<NavigationProps> = ({ currentView, setCurrentViewAction }) => {
	console.log(currentView, setCurrentViewAction);
	return (
		<>
			<DoodleJump />
		</>
	);
};

export default Game;
