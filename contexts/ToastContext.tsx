// contexts/ToastContext.tsx

'use client';

import React, { createContext, FC, ReactNode, useContext } from 'react';
import { toast, Toaster } from 'react-hot-toast';

type ToastContextType = {
	showToast: (message: string, type: 'success' | 'error') => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastOptions = {
	className: '',
	style: {
		background: '#333',
		color: '#fff',
	},
	success: {
		iconTheme: {
			primary: '#10B981',
			secondary: '#333',
		},
	},
	error: {
		iconTheme: {
			primary: '#EF4444',
			secondary: '#333',
		},
	},
};

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const showToast = (message: string, type: 'success' | 'error') => {
		if (type === 'success') {
			toast.success(message);
		} else {
			toast.error(message);
		}
	};

	return (
		<ToastContext.Provider value={ { showToast } }>
			{ children }
			<Toaster position="top-center" toastOptions={ toastOptions } />
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context.showToast;
};
