// components/DoodleJump/Toggle.tsx

'use client'

import React from 'react';

interface ToggleProps {
	isChecked: boolean;
	onToggle: (toggleState: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ isChecked, onToggle }) => {

	const handleToggle = (): void => {
		onToggle(!isChecked);
	};

	return (
		<label className="toggle-container">
			<input
				type="checkbox"
				className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300"
				checked={ isChecked }
				onChange={ handleToggle }
			/>
		</label>
	);
};

export default Toggle;
