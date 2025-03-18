// utils/playerUtils.ts

import { UseQueryResult } from '@tanstack/react-query';
import { DoodlePlayer } from '@/types';
import { UserResponse } from '@/types/api';
import { ElementType, PLATFORM, STAR } from '@/utils/consts';

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

export const loadImage = (src: string) => {
	const img = new Image();
	img.src = src;
	img.style.objectFit = 'contain';
	return img;
};

export const isColliding = (doodle: DoodlePlayer, element: { x: number; y: number }, size: {
	width: number;
	height: number
}) => {
	return doodle.x < element.x + size.width &&
		doodle.x + doodle.width > element.x &&
		doodle.y < element.y + size.height &&
		doodle.y + doodle.height > element.y;
};

export const random = (min: number, max: number) => Math.random() * (max - min) + min;

export const drawElement = (context: CanvasRenderingContext2D, element: {
	x: number;
	y: number,
	type: ElementType
}, platformImage: HTMLImageElement | null, starImage: HTMLImageElement | null) => {
	if (element.type === ElementType.STAR) {
		if (starImage) {
			context.drawImage(starImage, element.x, element.y, STAR.width, STAR.height);
		} else {
			context.fillStyle = 'yellow';
			context.fillRect(element.x, element.y, STAR.width, STAR.height);
		}
	} else {
		if (platformImage) {
			context.drawImage(platformImage, element.x, element.y, PLATFORM.width, PLATFORM.height);
		} else {
			context.fillStyle = 'green';
			context.fillRect(element.x, element.y, PLATFORM.width, PLATFORM.height);
		}
	}
};

export const getNextElementType = (elements: {
	x: number;
	y: number;
	type: ElementType
}[], score: number): ElementType => {
	return elements.some(e => e.type === ElementType.STAR)
		? ElementType.PLATFORM
		: ((score >= 10 && score < 12) || (score >= 50 && score % 50 < 2)) ? ElementType.STAR : ElementType.PLATFORM;
};

export const getInitialSlide = (balance: UseQueryResult<UserResponse, Error>) => {
	if (balance.isSuccess) {
		return Math.floor(balance.data?.starsBalance / 150);
	}
	return 0;
};
