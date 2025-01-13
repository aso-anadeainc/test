import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import Image from 'next/image';
import logoutIcon from '/public/assets/images/icons/logout.svg';
import { Button, styled, Typography, useMediaQuery, useTheme } from '@mui/material';

const Logout = () => {
	const router = useRouter();
	const isNotMobile = useMediaQuery(useTheme().breakpoints.up('md'));

	const handleLogout = () => {
		deleteCookie('token');
		router.push('/');
	};
	return (
	<LogoutButton onClick={handleLogout}>
		{!!isNotMobile && <Typography variant='button' sx={{ textTransform: 'none' }}>Logout</Typography>} 
		<Image src={logoutIcon} alt="Logout" width={24} height={24} />
		</LogoutButton>);
};

const LogoutButton = styled(Button)({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	gap: '12px',
});

export default Logout;
