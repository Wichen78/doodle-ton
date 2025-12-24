// components/DashboardLayout.tsx

'use client';

import { FC } from 'react';

import { TelegramLoginScript } from '@/app/utils/TelegramLoginScript';
import PlanetCarousel from '@/components/PlanetCarousel/PlanetCarousel';
import NextLevel from '@/components/PlanetCarousel/NextLevel';

interface DashboardLayoutProps {
	onPlay?: () => void;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ onPlay }) => {
	return (
		<>
			<img src="/title.svg" alt="Astro Ton" className="max-h-48 max-w-[95%] mx-auto" />
			{
				onPlay ? (
					<div>
						<PlanetCarousel onPlay={ onPlay } />
						<NextLevel />
					</div>
				) : (
					<div className="flex flex-col justify-center content-center">
						<TelegramLoginScript />
					</div>
				)
			}
		</>
	);
};

export default DashboardLayout;
