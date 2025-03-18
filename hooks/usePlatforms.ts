// hooks/usePlatform.ts

'use client';

import { useEffect, useRef } from 'react';
import { useGame } from '@/hooks/useGame';
import { ElementType, GameDifficulty, PLATFORM, STAR } from '@/utils/consts';
import { drawElement, getNextElementType, isColliding, random } from '@/utils/playerUtils';
import { DoodlePlayer } from '@/types';

export const usePlatforms = () => {
	const { score, increaseStarScore, increaseScore } = useGame();
	const scoreRef = useRef(score);

	useEffect(() => {
		scoreRef.current = score;
	}, [score]);

	const initializePlatforms = (canvas: HTMLCanvasElement) => {
		const platforms = [{
			x: canvas.width / 2 - PLATFORM.width / 2,
			y: canvas.height - 50,
			type: ElementType.PLATFORM
		}];

		for (let y = platforms[0].y - (PLATFORM.height + random(PLATFORM.minSpace, PLATFORM.maxSpace));
				 y > 0;
				 y -= PLATFORM.height + random(PLATFORM.minSpace, PLATFORM.maxSpace)) {
			platforms.push({
				x: random(25, canvas.width - 25 - PLATFORM.width),
				y,
				type: ElementType.PLATFORM
			});
		}

		return platforms;
	};

	const addNewElements = (canvas: HTMLCanvasElement, platforms: { x: number; y: number, type: ElementType }[]) => {
		let y = platforms[platforms.length - 1].y;

		while (y > 0) {
			const type = getNextElementType(platforms, scoreRef.current);
			const x = type === ElementType.STAR
				? platforms[platforms.length - 1].x + PLATFORM.width / 2 - STAR.width / 2
				: random(25, canvas.width - 25 - PLATFORM.width);

			y -= (type === ElementType.STAR ? STAR.height + STAR.minSpace : PLATFORM.height + random(PLATFORM.minSpace, PLATFORM.maxSpace));
			platforms.push({ x, y, type });
		}

		return platforms;
	};

	const updateElements = (
		context: CanvasRenderingContext2D,
		canvas: HTMLCanvasElement,
		elements: { x: number; y: number, type: ElementType }[],
		doodle: DoodlePlayer,
		prevDoodleY: number,
		platformImage: HTMLImageElement | null,
		starImage: HTMLImageElement | null
	) => {
		elements = elements.filter(element => {
			drawElement(context, element, platformImage, starImage);

			if (element.type === ElementType.STAR && isColliding(doodle, element, STAR)) {
				increaseStarScore(1);
				return false; // Supprime l'étoile collectée
			}

			if (element.type === ElementType.PLATFORM && doodle.dy > 0 &&
				prevDoodleY + doodle.height <= element.y && isColliding(doodle, element, PLATFORM)) {
				doodle.y = element.y - doodle.height;
				doodle.dy = GameDifficulty.BOUNCE_VELOCITY;
			}

			return true;
		});

		const visibleElements = elements.filter(e => e.y < canvas.height);
		increaseScore(elements.length - visibleElements.length);

		return visibleElements;
	};

	return { initializePlatforms, addNewElements, updateElements };
};
