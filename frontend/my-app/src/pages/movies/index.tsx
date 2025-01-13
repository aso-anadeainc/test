import Logout from '@/app/components/Logout';
import Layout from '@/app/features/Layout';
import MovieList from '@/app/features/MovieList';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import plusIcon from '/public/assets/images/icons/plus.svg';
import Image from 'next/image';

const Movies = () => {
  const { breakpoints } = useTheme();
  const isNotMobile = useMediaQuery(breakpoints.up('md'));
  const iconSize = isNotMobile ? 32 : 24;
  const pageTitle = () => (
    <>
        <Box display='flex' alignItems='end' gap={1}>
            <Typography variant='h2'>My movies</Typography>
            <Link href='/movies/new'>
                <Image src={plusIcon} alt='plus' width={iconSize} height={iconSize} />
            </Link>
        </Box> {<Logout />}
    </>
  )
  return <Layout pageTitle={pageTitle()}><MovieList /></Layout>;
};

export default Movies;
