// utils/consts.ts

export const PLATFORM = {
	width: 195,
	height: 60,
	minSpace: 45,
	maxSpace: 135,
};

export const STAR = {
	width: 50,
	height: 50,
	minSpace: 20,
};

export const MONSTER = {
	width: 75,
	height: 100,
	minSpace: 20,
};

export const BLACK_HOLE = {
	width: 50,
	height: 50,
	minSpace: 20,
};

export const GameDifficulty = {
	GRAVITY: 1,
	BOUNCE_VELOCITY: -37.5,
};

export enum ElementType {
	PLATFORM = 'PLATFORM',
	STAR = 'STAR',
	MONSTER = 'MONSTER',
	BLACK_HOLE = 'BLACK_HOLE',
}
