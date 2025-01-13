import { useState } from 'react';
import { Box, styled } from '@mui/material';
import { LoginForm, RegistrationForm } from '../components';


const Auth = () => {
	const [isLogin, setIsLogin] = useState(true);
	return <StyledBox>
		{isLogin ? <LoginForm setIsLogin={setIsLogin} /> : <RegistrationForm setIsLogin={setIsLogin} />}
	</StyledBox>;
};

const StyledBox = styled(Box)({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	height: '100vh'
});

export default Auth;
