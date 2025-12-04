// hooks/useGame.ts

'use client';

import { useContext } from 'react';
import { GameContext } from '@/contexts/GameContext';

/**
 * Custom hook that provides access to the `GameContext` in a React application.
 *
 * This hook retrieves the context value from `GameContext` and ensures that it is being used
 * within a `GameProvider`. If it is used outside of a `GameProvider`, an error is thrown.
 *
 * @throws {Error} If used outside of a `GameProvider`.
 * @returns {*} The value from the `GameContext`.
 */
export const useGame = () => {
	const context = useContext(GameContext);
	if (context === undefined) {
		throw new Error('useGame must be used within a GameProvider');
	}
	return context;
};
