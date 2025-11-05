// utils/game-mechanics.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TelegramLoginData } from '@telegram-login-ultimate/react';

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
	logout: () => void;
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
				logout: () => set(() => ({
					userTelegramInitData: '',
					userTelegramName: '',
					points: 0,
					stars: 0,
					isCompleted: true,
				})),
				isCompleted: false,
			}),
			{
				name: 'game-storage',
			},
		),
	),
);

export const jsonToTelegramInitData = (obj: TelegramLoginData): string => {
	const { hash, auth_date, ...user } = obj;
	const userString = JSON.stringify(user);
	const params = new URLSearchParams();
	params.set('user', userString);
	params.set('auth_date', String(auth_date));
	params.set('hash', hash);
	return params.toString();
};
