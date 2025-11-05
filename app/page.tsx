// app/page

'use client';

import React, { FC, useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import { GameProvider } from '@/providers/GameProvider';
import Loading from '@/components/Loading/Loading';
import DoodleJump from '@/components/DoodleJump/DoodleJump';

const Page: FC = () => {
	const [isAppropriateDevice, setIsAppropriateDevice] = useState<boolean | null>(null);

	useEffect(() => {
		const parser = new UAParser();
		const device = parser.getDevice();
		const isAllowed = process.env.NEXT_PUBLIC_ALLOW_ALL_DEVICES || device.type === 'mobile' || device.type === 'tablet';

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
		<GameProvider>
			<DoodleJump />
		</GameProvider>
	);
};

export default Page;
