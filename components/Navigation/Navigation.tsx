// components/Navigation/Navigation.tsx

'use client';

import { FC } from 'react';
import { IconProps, NavigationProps } from '@/types';
import Game from '@/assets/icons/Game';
import Mine from '@/assets/icons/Mine';
import Friends from '@/assets/icons/Friends';
import Coins from '@/assets/icons/Coins';

type NavItem = {
	name: string;
	icon?: FC<IconProps> | null;
	view: string;
};

const navItems: NavItem[] = [
	{ name: 'Game', icon: Game, view: 'game' },
	{ name: 'Mine', icon: Mine, view: 'mine' },
	{ name: 'Friends', icon: Friends, view: 'friends' },
	{ name: 'Earn', icon: Coins, view: 'earn' },
];

const Navigation: FC<NavigationProps> = ({ currentView, setCurrentViewAction }) => {
	const handleViewChange = (view: string) => {
		console.log('Attempting to change view to:', view);
		if (typeof setCurrentViewAction === 'function') {
			try {
				setCurrentViewAction(view);
				console.log('View change successful');
			} catch (error) {
				console.error('Error occurred while changing view:', error);
			}
		} else {
			console.error('setCurrentViewAction is not a function:', setCurrentViewAction);
		}
	};

	if (typeof setCurrentViewAction !== 'function') {
		console.error('setCurrentViewAction is not a function. Navigation cannot be rendered properly.');
		return null; // or return some fallback UI
	}

	return (
		<div
			className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-[#272a2f] flex justify-around items-center z-40 text-xs border-t border-[#43433b] max-h-24">
			{ navItems.map((item) => (
				<button
					key={ item.name }
					onClick={ () => handleViewChange(item.view) }
					className="flex-1"
				>
					<div
						className={ `flex flex-col items-center justify-center ${ currentView === item.view ? 'text-white bg-[#1c1f24]' : 'text-[#85827d]' } h-16 m-1 p-2 rounded-2xl` }>
						<div className="w-8 h-8 relative">
							{ item.icon && <item.icon className="w-full h-full" /> }
						</div>
						<p className="mt-1">{ item.name }</p>
					</div>
				</button>
			)) }
		</div>
	);
};

export default Navigation;
