// utils/playerUtils.ts

import { DoodlePlayer } from '@/types';

export const updatePlayers = (
	context: CanvasRenderingContext2D,
	doodle: DoodlePlayer,
	playerRightImageRef: HTMLImageElement | null,
	playerLeftImageRef: HTMLImageElement | null,
) => {
	const imageRef = doodle.dx >= 0 ? playerRightImageRef : playerLeftImageRef;

	if (imageRef) {
		context.drawImage(imageRef, doodle.x, doodle.y, doodle.width, doodle.height);
	} else {
		context.fillStyle = 'yellow';
		context.fillRect(doodle.x, doodle.y, doodle.width, doodle.height);
	}
};
