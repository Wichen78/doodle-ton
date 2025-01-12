// components/Home/Home.tsx

'use client';

import DoodleJump from '@/components/DoodleJump/DoodleJump.tsx';

interface HomeProps {
	currentView: string;
	setCurrentViewAction: (view: string) => void;
}

export default function Home({ currentView, setCurrentViewAction }: HomeProps) {
	console.log(currentView, setCurrentViewAction);
	return (
		<>
			<DoodleJump />
		</>
	);
}
