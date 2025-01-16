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
	permission: boolean;
	orientation: DeviceOrientationEvent | null;
	error: Error | null;
	requestAccess: () => Promise<boolean>;
	revokeAccess: () => Promise<void>;
};
