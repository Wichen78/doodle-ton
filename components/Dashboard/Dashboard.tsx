// components/Dashboard/Dashboard.tsx

'use client';

import React, { FC, useCallback, useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import { useLazyGetUser } from '@/hooks/api/useGetUser.ts';
import Game from '@/components/Game/Game.tsx';
import Loading from '@/components/Loading/Loading.tsx';
import Navigation from '@/components/Navigation/Navigation.tsx';

const Dashboard: FC = () => {
	const [currentView, setCurrentViewState] = useState<string>('loading');
	const { fetchTGUser, initData } = useLazyGetUser();

	const parser = new UAParser();
	const device = parser.getDevice();
	const isAppropriateDevice = process.env.NEXT_PUBLIC_ALLOW_ALL_DEVICES === 'true' || device.type === 'mobile' || device.type === 'tablet';

	useEffect(() => {
		if (isAppropriateDevice) {
			fetchTGUser();
		}
	}, []);

	const setCurrentView = (newView: string) => {
		console.log('Changing view to:', newView);
		setCurrentViewState(newView);
	};

	const renderCurrentView = useCallback(() => {
		switch (currentView) {
			default:
				return <Game
					currentView={ currentView }
					setCurrentViewAction={ setCurrentView }
				/>;
		}
	}, [currentView]);

	if (!isAppropriateDevice) {
		return (
			<div className="w-full h-screen max-w-xl flex flex-col items-center">
				<h1 className="text-2xl font-bold mb-4">Play on your mobile</h1>
			</div>
		);
	}

	if (!initData) {
		return (
			<Loading />
		);
	}

	return (
		<>
			{ renderCurrentView() }
			<Navigation
				currentView={ currentView }
				setCurrentViewAction={ setCurrentView }
			/>
		</>
	);
};

export default Dashboard;
