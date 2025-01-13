import { useQuery } from '@tanstack/react-query';
import { Box, Button, Typography, Grid2 as Grid, Pagination, CircularProgress, useTheme, useMediaQuery, styled } from '@mui/material';
import MovieCard from '../components/MovieCard';
import { getMovies } from '@/api/queries';
import { Movie } from '@/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
const EmptyState = () => {
	const { breakpoints } = useTheme();		
	const isNotMobile = useMediaQuery(breakpoints.up('md'));
	const router = useRouter();
	return (
		<StyledBoxEmptyState>
			<Typography variant='h2' textAlign='center'>Your movie list is empty</Typography>
			<Button variant='contained' color='primary' size='large' fullWidth={!isNotMobile} onClick={() => router.push('/movies/new')}>Add a new movie</Button>
		</StyledBoxEmptyState>
	);
};



const MovieList = () => {
	const params = useSearchParams();
	const offset = Number(params?.get('offset')) && Number(params?.get('offset')) > 0 ? Number(params?.get('offset')) : 1;
	const [page, setPage] = useState<number>(offset);
	const router = useRouter();
	const elementsPerPage = 10;
	const { data, refetch } = useQuery({
		queryKey: ['movies'],
		queryFn: () => getMovies(page - 1),
	});


	useEffect(() => {
		router.push(`?offset=${page}`, undefined, { shallow: true });
		refetch();
	}, [page, refetch]);
	
	if (!data) return  <StyledBoxLoading><CircularProgress /></StyledBoxLoading>;

	const {movies, totalCount} = data;
	const totalPages = Math.ceil(totalCount / elementsPerPage);

	const moviesList: Movie[] = movies || [];

	const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
		setPage(newPage);
	};

	return <Box>
			{moviesList.length > 0 ? 
			<Grid container spacing={2}>{moviesList.map((movie) => !!movie.id && <Grid key={movie.id} size={{xs:6, sm: 6, md: 4, lg: 3}}>
				<MovieCard {...movie as Required<typeof movie>} /></Grid>)}
				{totalPages > elementsPerPage && <Grid size={12}><Pagination count={totalPages} page={page} onChange={handlePageChange} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '120px'}} /></Grid>}
			</Grid> : <EmptyState/>}
	</Box>;
};

const StyledBoxEmptyState = styled(Box)({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	height: '100%',
	gap: '40px'
});

const StyledBoxLoading = styled(Box)({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '100%'
});

export default MovieList;
