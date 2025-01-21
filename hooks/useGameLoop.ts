// hooks/useGameLoop.ts

'use client';

import { RefObject, useEffect, useRef } from 'react';
import { DoodlePlayer } from '@/types';
import { addNewPlatforms, initializePlatforms, updatePlatforms } from '@/utils/platformUtils';
import { updatePlayers } from '@/utils/playerUtils.ts';
import { useGame } from '@/contexts/GameContext.tsx';

export const useGameLoop = (
	canvasRef: RefObject<HTMLCanvasElement>,
	orientation: DeviceOrientationEvent | null,
	gameEnded: boolean,
	setGameEndedAction: (gameEnded: boolean) => void
) => {
	const playerDir = useRef(0);
	const prevDoodleY = useRef(0);
	const platforms = useRef<{ x: number; y: number }[]>([]);
	const loopId = useRef<number | null>(null); // Ref pour stocker l'ID de l'animation
	const playerImageRef = useRef<HTMLImageElement | null>(null);
	const platformImageRef = useRef<HTMLImageElement | null>(null);
	const { increaseScore, resetScore } = useGame();

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const imgPlayer = new Image();
			imgPlayer.src = 'players/default.png';
			imgPlayer.style.objectFit = 'contain';
			playerImageRef.current = imgPlayer;

			const imgPlatform = new Image();
			imgPlatform.src = 'platforms/default.png';
			imgPlatform.style.objectFit = 'contain';
			platformImageRef.current = imgPlatform;
		}
	}, []);

	const resetGame = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		resetScore();
		platforms.current = initializePlatforms(canvas);
		prevDoodleY.current = canvas.height - 110;
		const context = canvas.getContext('2d');
		if (context) {
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
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
		platforms.current = initializePlatforms(canvas);

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

			doodle.dy += gravity;

			if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
				platforms.current = platforms.current.map((platform) => ({
					...platform,
					y: platform.y - doodle.dy / 2,
				}));

				platforms.current = addNewPlatforms(canvas, platforms.current);
			} else {
				doodle.y += doodle.dy;
			}

			// Gestion du mouvement du joueur
			if (playerDir.current < 0) {
				doodle.dx = -9;
			} else if (playerDir.current > 0) {
				doodle.dx = 9;
			} else {
				doodle.dx *= 0.9;
			}
			doodle.x += doodle.dx;

			if (doodle.x + doodle.width < 0) doodle.x = canvas.width;
			else if (doodle.x > canvas.width) doodle.x = -doodle.width;

			// Mettre à jour les plateformes et détecter les collisions
			const { visiblePlatforms, removedCount } = updatePlatforms(
				context,
				canvas,
				platforms.current,
				doodle,
				prevDoodleY.current,
				bounceVelocity,
				platformImageRef.current
			);
			platforms.current = visiblePlatforms;
			increaseScore(removedCount);

			updatePlayers(
				context,
				doodle,
				playerImageRef.current
			);

			// Mettre à jour prevDoodleY
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
			resetGame();
			loopId.current = requestAnimationFrame(loop);
		}

		return () => {
			if (loopId.current) cancelAnimationFrame(loopId.current);
		};
	}, [canvasRef, gameEnded, setGameEndedAction]);

	useEffect(() => {
		const gamma = orientation?.gamma || 0;
		playerDir.current = gamma < -10 ? -1 : gamma > 10 ? 1 : 0;
	}, [orientation]);
};
