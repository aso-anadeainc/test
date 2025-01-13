import { getMovie } from '@/api/queries';
import MovieForm from '@/app/components/MovieForm';
import Layout from '@/app/features/Layout';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const MoviePage = () => {
	const router = useRouter();
	const { id } = router.query;
	const { data } = useQuery({
		queryKey: ['movie', id],
		queryFn: () => getMovie(id as string)
	});


	useEffect(() => {
		if (!id) router.push('/movies');
	}, [id, router]);


	if (!id) return null;
	return <Layout pageTitle='Edit movie'><MovieForm movie={data} /></Layout>;
};

export default MoviePage;
