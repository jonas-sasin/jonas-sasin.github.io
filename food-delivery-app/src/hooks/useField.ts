import { ChangeEvent, useState } from 'react';

const useField = (
	id: string,
	required?: boolean
): [
	value: string,
	props: {
		id: string;
		value: string;
		onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
		onBlur: () => void;
		required?: boolean;
		error?: boolean;
		helperText?: string;
	}
] => {
	const [value, setValue] = useState('');
	const [touched, setTouched] = useState(false);

	const hasError = touched && !value;

	return [
		value,
		{
			id,
			value,
			onChange: e => setValue(e.target.value),
			onBlur: () => setTouched(true),
			required,
			error: hasError && required,
			helperText: hasError && required ? `${id} required!` : undefined
		}
	];
};

export default useField;
