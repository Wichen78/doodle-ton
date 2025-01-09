// app/page.tsx

'use client';

import Dashboard from '@/components/Dashboard/Dashboard';

export default function Page() {
	return (
		<div className="bg-[#1d2025] flex justify-center min-h-screen">
			<div className="w-full bg-[#1d2025] text-white h-screen font-bold flex flex-col max-w-xl">
				<Dashboard />
			</div>
		</div>
	);
}
