// components/TopBar/TopBar.tsx

'use client';

import { FC } from 'react';
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';
import { useGame } from '@/hooks/useGame';
import { useAPIAttempt } from '@/hooks/api/useAPIAttempt';
import { GameStatus } from '@/utils/game-mechanics';

interface TopBarProps {
	gameStatus: GameStatus;
	onStop: () => void;
}

const TopBar: FC<TopBarProps> = ({ gameStatus, onStop }) => {
	const { score, starScore } = useGame();
	const { best } = useAPIAttempt();

	return (
		<div className="w-full flex justify-between items-center px-2 py-1">
			<button
				className={ `flex items-center space-x-2 mr-6 p-2 rounded-3xl bg-yellow-500 border-solid border-2 border-white ${ gameStatus === GameStatus.ENDED ? 'invisible' : '' }` }
				onClick={ onStop }
			>
				{ gameStatus === GameStatus.RUNNING ? <PauseIcon className="size-8 text-white" /> :
					<PlayIcon className="size-8 text-white" /> }
			</button>

			<div className="flex flex-col items-center">
				{ gameStatus === GameStatus.ENDED && (
					<p className="text-2xl font-bold p-0.5 rounded bg-gray-400">{ best.isSuccess ? best.data.points : 0 }</p>) }
				<p className="text-2xl font-bold">{ Math.max(0, score) }</p>
			</div>
			<div
				className="flex items-center space-x-2 p-2 rounded-full bg-cyan-500 border-solid border-2 border-white">
				<p className="text-2xl font-bold">{ starScore }</p>
				<img src="/star.svg" alt="STAR" className="h-8" />
			</div>
		</div>
	);

};

export default TopBar;
