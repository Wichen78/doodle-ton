// components/Loading/UserLoader.tsx

'use client';

import React, { FC, ReactNode, useEffect } from 'react';
import { useLazyGetUser } from '@/hooks/api/useAPIUser';
import { useGameStore } from '@/utils/game-mechanics';
import Loading from '@/components/Loading/Loading';

interface UserLoaderProps {
	children?: ReactNode;
}

export const UserLoader: FC<UserLoaderProps> = ({ children }: UserLoaderProps) => {
	const { userTelegramInitData, isCompleted } = useGameStore();
	const { fetchUserTelegram } = useLazyGetUser();

	useEffect(() => {
		if (!isCompleted) {
			fetchUserTelegram();
		}
	}, []);

	if (!isCompleted) {
		return <Loading />;
	}

	if (!userTelegramInitData) {
		return (
			<h1 className="text-2xl font-bold mb-4 justify-self-center">Play on Telegram</h1>
		);
	}

	return children;
};
