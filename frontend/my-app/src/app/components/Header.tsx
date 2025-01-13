import { styled, Typography, Box } from '@mui/material';


const Header = ({ pageTitle }: { pageTitle: React.ReactNode | string }) => {
    const headerContent = () => {
        if (typeof pageTitle === 'string') {
            return <Box display='flex' alignItems='end' gap={1}>
                <Typography variant='h2'>{pageTitle}</Typography>
            </Box> 
        } else {
            return pageTitle;
        }
    }
    return pageTitle ? <StyledHeader>{headerContent()}</StyledHeader> : null;
};

const StyledHeader = styled('header')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '120px 0',
    [theme.breakpoints.down('md')]: {
        margin: '80px 0'
    }
}));

export default Header;
