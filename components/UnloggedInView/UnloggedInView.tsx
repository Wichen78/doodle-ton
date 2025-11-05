// components/UnloggedInView/UnloggedInView.tsx

'use client';

import { FC } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export const UnloggedInView: FC = () => {

	return (
		<div className="absolute w-full h-full top-0 flex flex-col justify-evenly">
			<DashboardLayout />
		</div>
	);
};
