// hooks/useGameLoop.ts

'use client';

import { RefObject, useEffect, useRef } from 'react';
import { DoodlePlayer } from '@/types';
import { usePlatforms } from '@/hooks/usePlatforms';
import { loadImage, updatePlayers } from '@/utils/playerUtils';
import { ElementType } from '@/utils/consts';
import { useGame } from '@/contexts/GameContext';

export const useGameLoop = (
	canvasRef: RefObject<HTMLCanvasElement>,
	orientation: DeviceOrientationEvent | null,
	gameEnded: boolean,
	setGameEndedAction: (gameEnded: boolean) => void
) => {
	const playerDir = useRef(0);
	const prevDoodleY = useRef(0);
	const elements = useRef<{ x: number; y: number, type: ElementType }[]>([]);
	const loopId = useRef<number | null>(null);
	const images = useRef<Record<string, HTMLImageElement | null>>({
		playerRight: null,
		playerLeft: null,
		platform: null,
		background: null,
		star: null
	});
	const { resetGame } = useGame();
	const { addNewElements, initializePlatforms, updateElements } = usePlatforms();

	useEffect(() => {
		if (typeof window !== 'undefined') {
			images.current = {
				playerRight: loadImage('players/default/right.svg'),
				playerLeft: loadImage('players/default/left.svg'),
				platform: loadImage('platforms/default.png'),
				background: loadImage('backgrounds/default.svg'),
				star: loadImage('star.svg'),
			};
		}
	}, []);

	const restoreGame = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		resetGame();
		elements.current = initializePlatforms(canvas);
		prevDoodleY.current = canvas.height - 110;
		canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const context = canvas.getContext('2d');
		if (!context) return;

		// Game size
		canvas.style.width = `${ window.innerWidth }px`;
		canvas.style.height = `${ window.innerHeight - 72 }px`;
		const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
		canvas.width = Math.floor(window.innerWidth * scale);
		canvas.height = Math.floor((window.innerHeight - 72) * scale);

		const gravity = 1;
		const bounceVelocity = -37.5;

		// Initialiser ou réinitialiser les plateformes
		elements.current = initializePlatforms(canvas);

		// Créer un objet doodle
		const doodle: DoodlePlayer = {
			width: 120,
			height: 180,
			x: canvas.width / 2 - 60,
			y: canvas.height - 240,
			dx: 0,
			dy: 0,
		};

		const loop = () => {
			if (gameEnded) {
				cancelAnimationFrame(loopId.current!);
				return;
			}

			context.clearRect(0, 0, canvas.width, canvas.height);
			if (images.current.background) {
				context.drawImage(images.current.background, 0, 0, canvas.width, canvas.height);
			}

			doodle.dy += gravity;
			if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
				elements.current = elements.current.map((el) => ({ ...el, y: el.y - doodle.dy / 2 }));
				elements.current = addNewElements(canvas, elements.current);
			} else {
				doodle.y += doodle.dy;
			}

			doodle.dx = playerDir.current * 9 || doodle.dx * 0.9;
			doodle.x = (doodle.x + doodle.dx + canvas.width) % canvas.width;

			elements.current = updateElements(
				context, canvas, elements.current, doodle, prevDoodleY.current,
				bounceVelocity, images.current.platform, images.current.star
			);

			updatePlayers(context, doodle, images.current.playerRight, images.current.playerLeft);
			prevDoodleY.current = doodle.y;

			// Loop or Stop
			if (doodle.y > canvas.height) {
				setGameEndedAction(true);
			} else {
				loopId.current = requestAnimationFrame(loop);
			}
		};

		// Replay
		if (!gameEnded) {
			restoreGame();
			loopId.current = requestAnimationFrame(loop);
		}

		return () => {
			if (loopId.current) cancelAnimationFrame(loopId.current);
		};
	}, [canvasRef, gameEnded, setGameEndedAction]);

	useEffect(() => {
		playerDir.current = orientation?.gamma ? Math.sign(orientation.gamma) : 0;
	}, [orientation]);
};
