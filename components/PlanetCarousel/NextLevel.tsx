// components/PlanetCarousel/NextLevel.tsx

'use client';

import { FC } from 'react';
import { useAPIUser } from '@/hooks/api/useAPIUser';
import { getInitialSlide } from '@/utils/playerUtils';

const NextLevel: FC = () => {
	const { balance } = useAPIUser();
	const initialSlide = getInitialSlide(balance);

	return (
		<div className="flex flex-col items-center space-y-1 py-1">
			<div className="flex items-center">
				<p className="font-bold p-0.5 rounded bg-gray-400 text-white">LEVEL UP</p>
				<img src="/unlocked.svg" alt="unlocked" className="h-6" />
			</div>
			<div className="flex space-x-1">
				<p className="text-yellow-400">{ balance.data?.starsBalance }</p>
				<div>|</div>
				<p className="text-yellow-400">{ (initialSlide + 1) * 150 }</p>
			</div>
		</div>
	);
};

export default NextLevel;
