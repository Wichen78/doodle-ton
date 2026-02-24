// components/PauseLayout/PauseLayout.tsx

'use client';

import { FC } from 'react';

interface PauseLayoutProps {
	onStop: () => void;
	onExit: () => void;
}

const PauseLayout: FC<PauseLayoutProps> = ({ onStop, onExit }) => {

	return (
		<div className="flex-1 flex items-center justify-center bg-blue-400/90">
			<div className="flex flex-col space-y-2">
				<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
								onClick={ onStop }>
					Resume
				</button>
				<button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl"
								onClick={ onExit }>
					Exit
				</button>
			</div>
		</div>
	);
};

export default PauseLayout;
