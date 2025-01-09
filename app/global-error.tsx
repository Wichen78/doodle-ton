// app/global-error.tsx

'use client';

interface GlobalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function GlobalError({ error, reset, }: GlobalErrorProps) {
	console.log('Error caught by boundary:', error);
	return (
		<html>
		<body>
			<h2>Something went wrong!</h2>
			<button onClick={ () => reset() }>Try again</button>
		</body>
		</html>
	);
}
