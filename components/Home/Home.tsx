// components/Home/Home.tsx

'use client';

interface HomeProps {
	currentView: string;
	setCurrentViewAction: (view: string) => void;
}

export default function Home({ currentView, setCurrentViewAction }: HomeProps) {
	console.log(currentView, setCurrentViewAction);
	return (
		<h1>HOME PAGE</h1>
	);
}
