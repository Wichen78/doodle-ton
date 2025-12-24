// components/SettingsLayout.tsx

'use client';

import { FC } from 'react';
import { useGameStore } from '@/utils/game-mechanics';

interface SettingsLayoutProps {
	onClose: () => void;
}

const SettingsLayout: FC<SettingsLayoutProps> = ({ onClose }) => {
	const { logout } = useGameStore();

	return (
		<div className="flex-1 flex items-center justify-center bg-blue-400/90">
			<div className="flex flex-col space-y-2">
				<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
								onClick={ () => logout() }>
					Log out
				</button>
				<button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl"
								onClick={ onClose }>
					Exit
				</button>
			</div>
		</div>
	);
};

export default SettingsLayout;
