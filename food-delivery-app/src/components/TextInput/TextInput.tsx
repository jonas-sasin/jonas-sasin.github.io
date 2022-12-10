import { TextField, TextFieldProps } from '@mui/material';
import { useField } from 'react-final-form';

type TextInputProps = {
	id: string;
} & Omit<TextFieldProps, 'value' | 'onChange' | 'onBlur' | 'error'>;

const TextInput = ({ id, ...props }: TextInputProps) => {
	const { input, meta } = useField(id, {
		subscription: { value: true, touched: true, error: true }
	});
	const hasError = meta.touched && meta.error;
	return <TextField {...props} {...input} error={hasError} />;
};

export default TextInput;
