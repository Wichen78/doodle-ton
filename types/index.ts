export interface DoodlePlayer {
	x: number;
	y: number;
	dx: number;
	dy: number;
	width: number;
	height: number;
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
