// utils/playerUtils.ts

import { UseQueryResult } from '@tanstack/react-query';
import { DoodlePlayer, Platform } from '@/types';
import { UserResponse } from '@/types/api';
import { ElementType, MONSTER, PLATFORM, STAR } from '@/utils/consts';

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

export const isColliding = (doodle: DoodlePlayer, element: Platform, size: {
	width: number;
	height: number
}) => {
	if (element.type === ElementType.MONSTER && element.options.alive === false) {
		return false;
	}
	const gapX = element.options.gapX || 0;
	return doodle.x < element.x + size.width + gapX &&
		doodle.x + doodle.width > element.x + gapX &&
		doodle.y < element.y + size.height &&
		doodle.y + doodle.height > element.y;
};

export const random = (min: number, max: number) => Math.random() * (max - min) + min;

export const drawElement = (context: CanvasRenderingContext2D, element: Platform, platformImage: HTMLImageElement | null, starImage: HTMLImageElement | null, monsterImage: HTMLImageElement | null) => {
	switch (element.type) {
		case ElementType.STAR:
			if (starImage) {
				context.drawImage(starImage, element.x, element.y, STAR.width, STAR.height);
			} else {
				context.fillStyle = 'yellow';
				context.fillRect(element.x, element.y, STAR.width, STAR.height);
			}
			break;

		case ElementType.MONSTER:
			if (monsterImage) {
				context.drawImage(monsterImage, element.options.gapX ? element.x + element.options.gapX : element.x, element.options.gapY ? element.options.gapY + element.y : element.y, MONSTER.width, MONSTER.height);
			} else {
				context.fillStyle = 'red';
				context.fillRect(element.x, element.y, MONSTER.width, MONSTER.height);
			}
			break;

		case ElementType.PLATFORM:
		default:
			if (platformImage) {
				context.drawImage(platformImage, element.x, element.y, PLATFORM.width, PLATFORM.height);
			} else {
				context.fillStyle = 'green';
				context.fillRect(element.x, element.y, PLATFORM.width, PLATFORM.height);
			}
			break;
	}
};

export const getNextElementType = (elements: Platform[], score: number): ElementType => {
	const hasStar = elements.some(e => e.type === ElementType.STAR);
	const hasEnemy = elements.some(e => e.type === ElementType.MONSTER);
	if (hasStar) {
		return hasEnemy ? ElementType.PLATFORM : (score >= 30 && score % 30 < 2) ? ElementType.MONSTER : ElementType.PLATFORM;
	}

	const shouldSpawnStar = (score >= 10 && score < 12) || (score >= 50 && score % 50 < 2);
	if (hasEnemy) {
		return shouldSpawnStar ? ElementType.STAR : ElementType.PLATFORM;
	}

	const shouldSpawnMonster = score >= 35 && score % 35 < 2;
	return shouldSpawnStar ? ElementType.STAR : shouldSpawnMonster ? ElementType.MONSTER : ElementType.PLATFORM;
};

export const getInitialSlide = (balance: UseQueryResult<UserResponse, Error>) => {
	if (balance.isSuccess) {
		return Math.floor(balance.data?.starsBalance / 150);
	}
	return 0;
};
