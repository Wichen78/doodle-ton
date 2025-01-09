import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';

export const metadata: Metadata = {
	title: 'Doodle TON',
	description: 'JUMP Jump jump',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1.0,
	maximumScale: 1.0,
	userScalable: false
};

export const geist = Geist({
	subsets: ['latin'],
});
