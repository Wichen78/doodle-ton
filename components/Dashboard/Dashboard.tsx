// components/Dashboard/Dashboard.tsx

'use client';

import { useCallback, useState } from 'react';
import LoadingScreen from '@/components/Loading/Loading';
import Home from '@/components/Home/Home';

function Dashboard() {
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
				return <Home
					currentView={ currentView }
					setCurrentViewAction={ setCurrentView }
				/>;
		}
	}, [currentView, isInitialized]);

	return (
		<>{ renderCurrentView() }</>
	);
}

export default Dashboard;
