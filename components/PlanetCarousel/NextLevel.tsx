// components/PlanetCarousel/NextLevel.tsx

'use client';

import { FC } from 'react';
import { useAPIUser } from '@/hooks/api/useAPIUser';
import { getInitialSlide } from '@/utils/playerUtils';

const NextLevel: FC = () => {
	const { balance } = useAPIUser();
	const initialSlide = getInitialSlide(balance);

	return (
		<div className="flex justify-center mb-4 text-yellow-400">
			{ balance.data?.starsBalance } | { (initialSlide + 1) * 150 }
		</div>
	);
};

export default NextLevel;
