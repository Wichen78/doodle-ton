// contexts/GameContext.tsx

'use client';

import { createContext, FC, ReactNode, useContext, useState } from 'react';

type GameContextType = {
	score: number;
	starScore: number;
	increaseScore: (score: number) => void;
	increaseStarScore: (score: number) => void;
	resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

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

export const useGame = () => {
	const context = useContext(GameContext);
	if (context === undefined) {
		throw new Error('useGame must be used within a GameProvider');
	}
	return context;
};
