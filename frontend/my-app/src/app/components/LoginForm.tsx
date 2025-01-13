import { Box, Button, Checkbox, FormControl, FormControlLabel, styled, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { login } from '@/api/queries';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import { setCookie } from 'cookies-next';
import { loginSchema, type LoginFormData } from '@/schemas/validation';
import { ZodError } from 'zod';
import { useSnackbar } from '@/context/SnackbarContext';
import { FormErrors } from '@/types';



const LoginForm = ({setIsLogin}: {setIsLogin: (isLogin: boolean) => void}) => {
	const router = useRouter();
	const { setUser } = useUser();
	const { showSnackbar } = useSnackbar();
	const [formData, setFormData] = useState<LoginFormData & { rememberMe: boolean }>({
		email: '',
		password: '',
		rememberMe: false
	});
	const [errors, setErrors] = useState<FormErrors>({});

	const validateForm = (): boolean => {
		try {
			loginSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof ZodError) {
				const newErrors: FormErrors = {};
				error.errors.forEach((err) => {
					if (err.path[0]) {
						newErrors[err.path[0].toString()] = err.message;
					}
				});
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}
		try {
			const response = await login(formData.email, formData.password);
			if (formData.rememberMe) {
				setCookie('token', response.token, {
					maxAge: 30 * 24 * 60 * 60, // 30 days
					secure: true,
					sameSite: 'strict',
					path: '/'
				});
			} else {
				setCookie('token', response.token, {
					secure: true,
					sameSite: 'strict',
					httpOnly: true,
					path: '/'
				});
			}
			
			setUser({
				email: response.email,
				id: response.id
			});
			
			showSnackbar('Logged in successfully', 'success');
			router.push('/movies');
		} catch (error) {
			showSnackbar('Login failed', 'error');
			console.error('Login error:', error);
		}
	};

	return <StyledBox>
		<Typography variant="h1" fontWeight={500} sx={{mb: '40px'}}>Sign in</Typography>
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
					size='small' 
					type='password' 
					value={formData.password} 
					onChange={(e) => setFormData({...formData, password: e.target.value})}
					error={!!errors.password}
					helperText={errors.password}
				/>
			</FormControl>
			<FormControl>
				<FormControlLabel
					control={
						<Checkbox 
							checked={formData.rememberMe}
							onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
						/>
					}
					label={<Typography fontSize='14px' fontWeight={400}>Remember me</Typography>}
				/>
			</FormControl>
			<Button type="submit" variant="contained" color="primary" size='large' fullWidth>
				Login
			</Button>
			<Button variant="outlined" color="primary" size='large' fullWidth onClick={() => setIsLogin(false)}>Register</Button>
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

export default LoginForm;
