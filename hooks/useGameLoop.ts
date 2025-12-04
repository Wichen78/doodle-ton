// hooks/useGameLoop.ts

'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import { usePlatforms } from '@/hooks/usePlatforms';
import { DoodlePlayer, Platform } from '@/types';
import { loadImage, updatePlayers } from '@/utils/playerUtils';
import { GameDifficulty } from '@/utils/consts';
import { GameStatus } from '@/utils/game-mechanics';

/**
 * A custom hook that manages the game loop and states for a canvas-based game.
 * It initializes the game, handles input, updates game elements, manages collision detection, and renders each frame.
 *
 * @param {RefObject<HTMLCanvasElement>} canvasRef - Reference to the canvas element used for rendering the game.
 * @param {DeviceOrientationEvent | null} orientation - Device orientation data used for player movement.
 * @param {GameStatus} gameStatus - Current status of the game, used to control game flow (e.g., running, ended).
 * @param {(status: GameStatus) => void} setGameStatus - Function to update the game's status (e.g., start, end the game).
 *
 * @returns {void}
 */
export const useGameLoop = (
	canvasRef: RefObject<HTMLCanvasElement>,
	orientation: DeviceOrientationEvent | null,
	gameStatus: GameStatus,
	setGameStatus: (status: GameStatus) => void
) => {
	const playerDir = useRef(0);
	const prevDoodleY = useRef(0);
	const elements = useRef<Platform[]>([]);
	const loopId = useRef<number | null>(null);
	const images = useRef<Record<string, HTMLImageElement | null>>({
		playerRight: null,
		playerLeft: null,
		platform: null,
		background: null,
		playerJetpack: null,
	});
	const { addNewElements, initializePlatforms, updateElements } = usePlatforms();
	const [gameState, setGameState] = useState<{
		canvas: HTMLCanvasElement | null;
		context: CanvasRenderingContext2D | null;
		doodle: DoodlePlayer | null;
	}>({ canvas: null, context: null, doodle: null });

	// Load images
	useEffect(() => {
		if (typeof window !== 'undefined') {
			images.current = {
				playerRight: loadImage('players/default/right.svg'),
				playerLeft: loadImage('players/default/left.svg'),
				platform: loadImage('platforms/default.png'),
				background: loadImage('backgrounds/default.svg'),
				playerJetpack: loadImage('jetpack/player.svg'),
			};
		}
	}, []);

	// Update player direction
	useEffect(() => {
		playerDir.current = orientation?.gamma && Math.abs(orientation.gamma) > 8 ? Math.sign(orientation.gamma) : 0;
	}, [orientation]);

	useEffect(() => {
		if (gameStatus === GameStatus.ENDED) {
			initializeGame();
		}
	}, [gameStatus]);

	useEffect(() => {
		if (gameState.canvas && gameState.context && gameState.doodle) {
			loopId.current = requestAnimationFrame(loop);
		}
	}, [gameState, gameStatus]);

	const createDoodle = (canvas: HTMLCanvasElement): DoodlePlayer => ({
		width: 120,
		height: 180,
		x: canvas.width / 2 - 60,
		y: canvas.height - 240,
		dx: 0,
		dy: 0,
		drawOnly: false,
		jetpack: false,
		jetpackLimit: 0
	});

	const setupCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas) return null;

		const context = canvas.getContext('2d');
		if (!context) return null;

		canvas.style.width = `${ window.innerWidth }px`;
		canvas.style.height = `${ window.innerHeight }px`;
		const scale = window.devicePixelRatio;
		canvas.width = Math.floor(window.innerWidth * scale);
		canvas.height = Math.floor(window.innerHeight * scale);

		return { canvas, context };
	};

	const initializeGame = () => {
		const setup = setupCanvas();
		if (!setup) return;

		const { canvas, context } = setup;
		elements.current = initializePlatforms(canvas);
		prevDoodleY.current = canvas.height - 110;

		const doodle = createDoodle(canvas);
		setGameState({ canvas, context, doodle });
	};

	const loop = () => {
		if (!gameState.canvas || !gameState.context || !gameState.doodle) return;
		const { canvas, context, doodle } = gameState;

		if (gameStatus !== GameStatus.RUNNING) {
			cancelAnimationFrame(loopId.current!);
			return;
		}

		context.clearRect(0, 0, canvas.width, canvas.height);

		if (images.current.background) {
			context.drawImage(images.current.background, 0, 0, canvas.width, canvas.height);
		}

		// Gestion du mouvement vertical
		if (doodle?.jetpack) {
			if (doodle.dy > -66) {
				doodle.dy -= GameDifficulty.GRAVITY;
			}
		} else {
			doodle.dy += GameDifficulty.GRAVITY;
		}

		if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
			elements.current = elements.current.map((el) => ({ ...el, y: el.y - doodle.dy / 2 }));
			elements.current = addNewElements(canvas, doodle, elements.current);
		} else {
			doodle.y += doodle.dy;
		}

		// Gestion du mouvement horizontal
		doodle.dx = playerDir.current * 9 || doodle.dx * 0.9;
		doodle.x = (doodle.x + doodle.dx + canvas.width) % canvas.width;

		// Mise à jour des plateformes et collisions
		elements.current = updateElements(
			context, canvas, elements.current, doodle, prevDoodleY.current, images.current.platform,
		);

		// Affichage du joueur
		updatePlayers(context, doodle, images.current.playerRight, images.current.playerLeft, images.current.playerJetpack);
		prevDoodleY.current = doodle.y;

		// Condition de fin de jeu
		if (doodle.y > canvas.height) {
			setGameStatus(GameStatus.ENDED);
		} else {
			loopId.current = requestAnimationFrame(loop);
		}
	};

};

