// components/Dashboard/Dashboard.tsx

'use client';

import { FC, useCallback, useState } from 'react';
import LoadingScreen from '@/components/Loading/Loading';
import Game from '@/components/Game/Game.tsx';
import Navigation from '@/components/Navigation/Navigation.tsx';

const Dashboard: FC = () => {
	const [currentView, setCurrentViewState] = useState<string>('loading');
	const [isInitialized, setIsInitialized] = useState(false);

	const setCurrentView = (newView: string) => {
		console.log('Changing view to:', newView);
		setCurrentViewState(newView);
	};

	const renderCurrentView = useCallback(() => {
		if (!isInitialized) {
			return <LoadingScreen
				setCurrentViewAction={ setCurrentView }
				setIsInitializedAction={ setIsInitialized }
			/>;
		}

		switch (currentView) {
			default:
				return <Game
					currentView={ currentView }
					setCurrentViewAction={ setCurrentView }
				/>;
		}
	}, [currentView, isInitialized]);

	return (
		<>
			{ renderCurrentView() }
			{ isInitialized && currentView !== 'loading' && (
				<Navigation
					currentView={ currentView }
					setCurrentViewAction={ setCurrentView }
				/>
			) }
		</>
	);
};

export default Dashboard;
