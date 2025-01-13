import { Box, styled } from '@mui/material';
const Footer = () => {
    return <StyledBox ></StyledBox>;
};

const StyledBox = styled(Box)(({ theme }) => ({
    height: '110px',
    backgroundImage: 'url(/assets/images/icons/footer-bg.svg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
	width: '100%',
    marginTop: '120px',
    [theme.breakpoints.down('md')]: {
        marginTop: '80px'
    }
}));

export default Footer;
