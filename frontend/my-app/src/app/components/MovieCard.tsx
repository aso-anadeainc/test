import {  Card, CardActionArea, CardContent, CardMedia, styled, Typography } from '@mui/material';
import Link from 'next/link';

const MovieCard: React.FC<MovieCardProps> = ({id, image, title, publishingYear, description}) => {
	const imageUrl = `${process.env.NEXT_PUBLIC_STATIC_URL}/${image}`;
	

	return <StyledCard>
		<CardActionArea component={Link} href={`/movies/${id}`}>
			<StyledCardMedia
					image={imageUrl}
					title={title}
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" >
						{title}
					</Typography>
					<Typography gutterBottom variant="body2" >
						{description}
					</Typography>
					<Typography variant="body2">
						{publishingYear}
					</Typography>
				</CardContent>
			</CardActionArea>
	</StyledCard>
};

const StyledCard = styled(Card)(({ theme }) => ({
	padding: '8px',
	borderRadius: '12px',
	backgroundColor: theme.palette.background.default,
	[theme.breakpoints.down('md')]: {
		padding: '0',
		height: '100%',
	},
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
	height: '400px',
	borderRadius: '12px',
	[theme.breakpoints.down('md')]: {
		height: '245px',
	},
}));

interface MovieCardProps {
	id: number;
	image: string;
	title: string;
	publishingYear: number;
	description: string;
}

export default MovieCard;
