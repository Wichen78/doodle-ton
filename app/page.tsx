// app/page.tsx

'use client';

import { FC, Suspense } from 'react';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { GameProvider } from '@/contexts/GameContext.tsx';
import Dashboard from '@/components/Dashboard/Dashboard';
import Loading from '@/components/Loading/Loading.tsx';

const queryClient = new QueryClient();

const Page: FC = () => {
	return (
		<div className="w-full bg-[#1d2025] text-white h-full overflow-y-hidden no-scrollbar font-bold">
			<QueryClientProvider client={ queryClient }>
				<GameProvider>
					<Suspense fallback={ <Loading /> }>
						<Dashboard />
					</Suspense>
				</GameProvider>
			</QueryClientProvider>
		</div>
	);
};

export default Page;
