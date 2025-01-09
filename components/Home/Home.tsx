// components/Home/Home.tsx

'use client';

interface HomeProps {
	currentView: string;
	setCurrentViewAction: (view: string) => void;
}

export default function Home({ currentView, setCurrentViewAction }: HomeProps) {
	return (
		<h1>HOME PAGE</h1>
	);
}
