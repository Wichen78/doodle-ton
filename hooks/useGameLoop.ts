import { useEffect, useRef } from 'react';
import { addNewPlatforms, initializePlatforms, updatePlatforms } from '@/utils/platformUtils';
import { DoodlePlayer } from '@/types';

export const useGameLoop = (canvasRef: React.RefObject<HTMLCanvasElement>, orientation: DeviceOrientationEvent | null) => {
	const playerDir = useRef(0);
	const prevDoodleY = useRef(0);
	const platforms = useRef<{ x: number; y: number }[]>([]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const context = canvas.getContext('2d');
		if (!context) return;

		const gravity = 0.33;
		const bounceVelocity = -12.5;

		// Initialize platforms
		platforms.current = initializePlatforms(canvas);

		const doodle: DoodlePlayer = {
			width: 40,
			height: 60,
			x: canvas.width / 2 - 20,
			y: canvas.height - 110,
			dx: 0,
			dy: 0,
		};

		const loop = () => {
			requestAnimationFrame(loop);

			context.clearRect(0, 0, canvas.width, canvas.height);

			doodle.dy += gravity;

			if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
				platforms.current = platforms.current.map((platform) => ({
					...platform,
					y: platform.y - doodle.dy / 2, // Déplacer les plateformes vers le bas
				}));

				// Ajouter de nouvelles plateformes en haut si nécessaire
				platforms.current = addNewPlatforms(canvas, platforms.current);
			} else {
				doodle.y += doodle.dy;
			}

			// Handle player movement
			if (playerDir.current < 0) {
				doodle.dx = -3;
			} else if (playerDir.current > 0) {
				doodle.dx = 3;
			} else {
				doodle.dx *= 0.9;
			}
			doodle.x += doodle.dx;

			if (doodle.x + doodle.width < 0) doodle.x = canvas.width;
			else if (doodle.x > canvas.width) doodle.x = -doodle.width;

			// Update platforms and detect collisions
			platforms.current = updatePlatforms(context, canvas, platforms.current, doodle, prevDoodleY.current, bounceVelocity);

			// Draw player
			context.fillStyle = 'yellow';
			context.fillRect(doodle.x, doodle.y, doodle.width, doodle.height);

			// Update prevDoodleY
			prevDoodleY.current = doodle.y;
		};

		requestAnimationFrame(loop);
	}, [canvasRef]);

	useEffect(() => {
		const gamma = orientation?.gamma || 0;
		playerDir.current = gamma < -10 ? -1 : gamma > 10 ? 1 : 0;
	}, [orientation]);
};
