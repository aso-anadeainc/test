import { Box, Container, styled } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LayoutProps } from '@/types';

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
    return <StyledBox bgcolor='background.default'>
				<Container>
					<Header pageTitle={pageTitle || ''} />
					{children}
				</Container>
				<Footer />		
    	</StyledBox>
			
};

const StyledBox = styled(Box)({
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	alignItems: 'center'
});



export default Layout;
