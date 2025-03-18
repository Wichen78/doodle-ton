// utils/game-mechanics.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export enum GameStatus {
	RUNNING = 'RUNNING',
	PAUSED = 'PAUSED',
	ENDED = 'ENDED',
}

export interface GameState {
	userTelegramInitData: string;
	userTelegramName: string;
	points: number;
	stars: number;
	increase: (by: number) => void;
	initializeState: (initialState: Partial<GameState>) => void;
	isCompleted: boolean;
}

export interface InitialGameState {
	userTelegramInitData: string;
	userTelegramName: string;
	points: number;
	stars: number;
	isCompleted: boolean;
}

export const useGameStore = create<GameState>()(
	devtools(
		persist(
			(set) => ({
				userTelegramInitData: '',
				userTelegramName: '',
				points: 0,
				stars: 0,
				increase: (by) => set((state) => ({ points: state.points + by })),
				initializeState: (initialState) => set((state) => ({ ...state, ...initialState })),
				isCompleted: false,
			}),
			{
				name: 'game-storage',
			},
		),
	),
);
