// components/Dashboard/Dashboard.tsx

'use client';

import React, { FC, useCallback, useState } from 'react';
import Game from '@/components/Game/Game';
import Navigation from '@/components/Navigation/Navigation';

const Dashboard: FC = () => {
	const [currentView, setCurrentViewState] = useState<string>('loading');

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
