import { ElementType } from '@/utils/consts.ts';

export interface DoodlePlayer {
	x: number;
	y: number;
	dx: number;
	dy: number;
	width: number;
	height: number;
	drawOnly: boolean;
}

export interface DeviceOrientationEventIOS extends DeviceOrientationEvent {
	requestPermission?: () => Promise<'granted' | 'denied'>;
}

export interface DeviceOrientationData {
	orientation: DeviceOrientationEvent | null;
	error: Error | null;
	requestAccess: () => Promise<boolean>;
	revokeAccess: () => Promise<void>;
}

export interface IconProps {
	size?: number;
	className?: string;
}

export interface NavigationProps {
	currentView: string;
	setCurrentViewAction: (view: string) => void;
}

export type GameContextType = {
	score: number;
	starScore: number;
	increaseScore: (score: number) => void;
	increaseStarScore: (score: number) => void;
	resetGame: () => void;
}

export interface PlatformOption {
	direction: boolean;
	alive?: boolean;
	gapX?: number;
	gapY?: number;
}

export interface Platform {
	x: number;
	y: number;
	type: ElementType;
	options: PlatformOption;
}
