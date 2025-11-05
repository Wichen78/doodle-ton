// providers/UserProvider.tsx

'use client';

import { FC, ReactNode, useEffect } from 'react';

import { useLazyGetUser } from '@/hooks/api/useAPIUser';
import { useGameStore } from '@/utils/game-mechanics';
import { UnloggedInView } from '@/components/UnloggedInView/UnloggedInView';
import Loading from '@/components/Loading/Loading';

interface UserLoaderProps {
	children?: ReactNode;
}

export const UserProvider: FC<UserLoaderProps> = ({ children }: UserLoaderProps) => {
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
			<UnloggedInView />
		);
	}

	return children;
};
