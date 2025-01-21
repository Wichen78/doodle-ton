// utils/platformUtils.ts

import { DoodlePlayer } from '@/types';
import { PLATFORM } from '@/utils/consts.ts';

export const initializePlatforms = (canvas: HTMLCanvasElement) => {
	const platformStart = canvas.height - 50;

	const platforms = [
		{
			x: canvas.width / 2 - PLATFORM.width / 2,
			y: platformStart,
		},
	];

	let y = platformStart;
	while (y > 0) {
		const x = random(25, canvas.width - 25 - PLATFORM.width);
		y -= PLATFORM.height + random(PLATFORM.minSpace, PLATFORM.maxSpace);
		platforms.push({ x, y });
	}

	return platforms;
};

export const addNewPlatforms = (
	canvas: HTMLCanvasElement,
	platforms: { x: number; y: number }[]
) => {
	let y = platforms[platforms.length - 1].y;

	while (y > 0) {
		const x = random(25, canvas.width - 25 - PLATFORM.width);
		y -= (PLATFORM.height + random(PLATFORM.minSpace, PLATFORM.maxSpace));
		platforms.push({ x, y });
	}

	return platforms;
};

export const updatePlatforms = (
	context: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	platforms: { x: number; y: number }[],
	doodle: DoodlePlayer,
	prevDoodleY: number, // Position précédente du doodle
	bounceVelocity: number,
	platformImage: HTMLImageElement | null,
) => {

	// Update and draw each platform
	platforms.forEach((platform) => {
		if (platformImage) {
			context.drawImage(platformImage, 0, 0, platformImage.width, platformImage.height, platform.x, platform.y, PLATFORM.width, PLATFORM.height);
		} else {
			context.fillStyle = 'green';
			context.fillRect(platform.x, platform.y, PLATFORM.width, PLATFORM.height);
		}

		// Check for collision with the player
		if (
			doodle.dy > 0 && // Le doodle doit tomber
			prevDoodleY + doodle.height <= platform.y && // Le doodle était au-dessus de la plateforme
			doodle.x < platform.x + PLATFORM.width &&
			doodle.x + doodle.width > platform.x &&
			doodle.y + doodle.height > platform.y
		) {
			doodle.y = platform.y - doodle.height; // Positionner le doodle sur la plateforme
			doodle.dy = bounceVelocity; // Appliquer la vélocité de rebond
		}
	});

	const visiblePlatforms = platforms.filter((platform) => platform.y < canvas.height);

	const removedCount = platforms.length - visiblePlatforms.length;

	return { visiblePlatforms, removedCount };
};

const random = (min: number, max: number) => Math.random() * (max - min) + min;
