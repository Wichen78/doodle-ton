// providers/GameProvider.tsx

'use client';

import { FC, ReactNode, useState } from 'react';
import { GameContext } from '@/contexts/GameContext';

export const GameProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [score, setScore] = useState<number>(-1);
	const [starScore, setStarScore] = useState<number>(0);

	const increaseScore = (value: number) => {
		setScore(prev => prev + value);
	};

	const increaseStarScore = (value: number) => {
		setStarScore(prev => prev + value);
	};

	const resetGame = () => {
		setScore(0);
		setStarScore(0);
	};

	return (
		<GameContext.Provider value={ { score, starScore, increaseScore, increaseStarScore, resetGame } }>
			{ children }
		</GameContext.Provider>
	);
};
