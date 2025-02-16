// app/page

'use client';

import React, { FC, useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { GameProvider } from '@/contexts/GameContext';
import Dashboard from '@/components/Dashboard/Dashboard';
import Loading from '@/components/Loading/Loading';
import { UserLoader } from '@/components/Loading/UserLoader';

const queryClient = new QueryClient();

const Page: FC = () => {
	const [isAppropriateDevice, setIsAppropriateDevice] = useState<boolean | null>(null);

	useEffect(() => {
		const parser = new UAParser();
		const device = parser.getDevice();
		const isAllowed = process.env.NEXT_PUBLIC_ALLOW_ALL_DEVICES === 'true' || device.type === 'mobile' || device.type === 'tablet';

		setIsAppropriateDevice(isAllowed);
	}, []);

	if (isAppropriateDevice === null) {
		return <Loading />;
	}

	if (!isAppropriateDevice) {
		return (
			<div className="w-full bg-[#1d2025] text-white h-screen overflow-y-hidden no-scrollbar font-bold">
				<h1 className="text-2xl font-bold mb-4 justify-self-center">Play on your mobile</h1>
			</div>
		);
	}

	return (
		<div className="w-full bg-[#1d2025] text-white h-screen overflow-y-hidden no-scrollbar font-bold">
			<QueryClientProvider client={ queryClient }>
				<GameProvider>
					<UserLoader>
						<Dashboard />
					</UserLoader>
				</GameProvider>
			</QueryClientProvider>
		</div>
	);
};

export default Page;
