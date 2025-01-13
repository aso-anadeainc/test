import { register } from '@/api/queries';
import { Box, Button, FormControl, styled, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import { registerSchema, type RegisterFormData } from '@/schemas/validation';
import { ZodError } from 'zod';
import { useSnackbar } from '@/context/SnackbarContext';
import { AxiosError } from 'axios';
import { FormErrors } from '@/types';



const RegistrationForm = ({setIsLogin}: {setIsLogin: (isLogin: boolean) => void}) => {
	const [formData, setFormData] = useState<RegisterFormData>({
		email: '',
		password: '',
		confirmPassword: ''
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const router = useRouter();
	const { showSnackbar } = useSnackbar();

	const validateForm = (): boolean => {
		try {
			registerSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof ZodError) {
				const newErrors: FormErrors = {};
				error.errors.forEach((err) => {
					const path = err.path[0]?.toString();
					if (path) {
						newErrors[path] = newErrors[path]
							? `${newErrors[path]}. ${err.message}`
							: err.message;
					}
				});
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleCancel = () => {
		setIsLogin(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}
		try {
			const response = await register(formData.email, formData.password);
			setCookie('token', response.token);
			showSnackbar('Registration successful', 'success');
			router.push('/movies');
		} catch (error) {
			const errorMessage = error instanceof AxiosError 
				? error.response?.data?.message || 'Registration failed'
				: 'Registration failed';
			showSnackbar(errorMessage, 'error');
			console.error('Registration error:', error);
		}
	};

	return <StyledBox>
		<Typography variant="h1" fontWeight={500} sx={{mb: '40px'}}>Sign up</Typography>
		<StyledForm onSubmit={handleSubmit}>
			<FormControl sx={{width: '100%'}}>
				<TextField 
					label="Email" 
					size='small' 
					value={formData.email} 
					onChange={(e) => setFormData({...formData, email: e.target.value})}
					error={!!errors.email}
					helperText={errors.email}
				/>
			</FormControl>
			<FormControl sx={{width: '100%'}} >
				<TextField 
					label="Password" 
					type="password"
					size='small' 
					value={formData.password} 
					onChange={(e) => setFormData({...formData, password: e.target.value})}
					error={!!errors.password}
					helperText={errors.password}
				/>
			</FormControl>
			<FormControl sx={{width: '100%'}} >
				<TextField 
					label="Confirm Password" 
					type="password"
					size='small' 
					value={formData.confirmPassword} 
					onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
					error={!!errors.confirmPassword}
					helperText={errors.confirmPassword}
				/>
			</FormControl>
			<Button type="submit" variant="contained" color="primary" size='large' fullWidth>Register</Button>
			<Button variant="outlined" color="primary" size='large' fullWidth onClick={handleCancel}>Cancel</Button>
		</StyledForm>
	</StyledBox>;
};

const StyledBox = styled(Box)({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	width: '100%',
	minHeight: 'calc(100vh - 110px - 32px)',
});

const StyledForm = styled('form')({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	gap: '24px',
	width: '300px',
	maxWidth: '100%',
});

export default RegistrationForm;
