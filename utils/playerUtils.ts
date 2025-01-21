// utils/playerUtils.ts

import { DoodlePlayer } from '@/types';

export const updatePlayers = (
	context: CanvasRenderingContext2D,
	doodle: DoodlePlayer,
	playerImage: HTMLImageElement | null,
) => {
	if (playerImage) {
		context.drawImage(
			playerImage,
			0,
			0,
			playerImage.width,
			playerImage.height,
			doodle.x,
			doodle.y,
			doodle.width,
			doodle.height
		);
	} else {
		context.fillStyle = 'yellow';
		context.fillRect(doodle.x, doodle.y, doodle.width, doodle.height);
	}
};
