// app/layout.tsx

import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/contexts/ToastContext';

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

const geist = Geist({
	subsets: ['latin'],
});

export default function RootLayout({ children, }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={ geist.className }>
		<body>
			<ToastProvider>
				<main>{ children }</main>
			</ToastProvider>
		</body>
		</html>
	);
}
