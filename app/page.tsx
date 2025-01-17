// app/page.tsx

'use client';

import Dashboard from '@/components/Dashboard/Dashboard';
import { FC } from 'react';

const Page: FC = () => {
	return (
		<div className="w-full bg-[#1d2025] text-white h-full overflow-y-hidden no-scrollbar font-bold">
			<Dashboard />
		</div>
	);
};

export default Page;
