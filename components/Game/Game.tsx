// components/Game/Game.tsx

'use client';

import { NavigationProps } from '@/types';
import DoodleJump from '@/components/DoodleJump/DoodleJump.tsx';
import { FC } from 'react';

const Game: FC<NavigationProps> = ({ currentView, setCurrentViewAction }) => {
	console.log(currentView, setCurrentViewAction);
	return (
		<>
			<DoodleJump />
		</>
	);
};

export default Game;
