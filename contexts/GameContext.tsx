// contexts/GameContext.tsx

'use client';

import React, { createContext, FC, ReactNode, useContext, useState } from 'react';

type GameContextType = {
	score: number;
	increaseScore: (score: number) => void;
	resetScore: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [score, setScore] = useState<number>(-1);

	const increaseScore = (value: number) => {
		setScore(prev => prev + value);
	};

	const resetScore = () => {
		setScore(0);
	}

	return (
		<GameContext.Provider value={ { score, increaseScore, resetScore } }>
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
