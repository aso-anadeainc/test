import { Grid2 as Grid, Typography, FormControl, TextField, Button, styled, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import Dropzone from 'react-dropzone';
import Image from 'next/image';
import downloadIcon from '/public/assets/images/icons/download.svg';
import { useState, useEffect } from 'react';
import { Movie } from '@/types';
import { updateMovie, createMovie, deleteMovie } from '@/api/queries';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { movieSchema, movieFileSchema, type MovieFormData } from '@/schemas/validation';
import { ZodError } from 'zod';
import { useSnackbar } from '@/context/SnackbarContext';

interface FormErrors {
	[key: string]: string;
}

const MovieForm: React.FC<MovieFormProps> = ({movie}) => {
	const router = useRouter();
	const { user } = useUser();
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const emptyMovie = {
		id: 0,
		title: '',
		publishingYear: 0,
		image: '',
		description: '',
		userId: user?.id || 0
	}
	const [formData, setFormData] = useState<Movie>(movie || emptyMovie);
	const isEdit = !!movie?.id;
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [errors, setErrors] = useState<FormErrors>({});

	useEffect(() => {
		if (movie) {
			setFormData(movie);
		}
	}, [movie]);

	useEffect(() => {
		if (movie?.image) {
			setSelectedImage(`${process.env.NEXT_PUBLIC_STATIC_URL}/${movie.image}`);
		}
	}, [movie]);

	const updateMutation = useMutation({
		mutationFn: updateMovie,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['movie', movie?.id] });
			queryClient.invalidateQueries({ queryKey: ['movies'] });
			showSnackbar('Movie updated successfully', 'success');
			router.push('/movies');
		},
		onError: () => {
			showSnackbar('Failed to update movie', 'error');
		}
	});

	const createMutation = useMutation({
		mutationFn: createMovie,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['movies'] });
			showSnackbar('Movie created successfully', 'success');
			router.push('/movies');
		},
		onError: () => {
			showSnackbar('Failed to create movie', 'error');
		}
	});

	const deleteMutation = useMutation({
		mutationFn: deleteMovie,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['movies'] });
			showSnackbar('Movie deleted successfully', 'success');
			router.push('/movies');
		},
		onError: () => {
			showSnackbar('Failed to delete movie', 'error');
		}
	});

	const handleDrop = async (acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		if (file) {
			try {
				await movieFileSchema.parseAsync({ file });
				const imageUrl = URL.createObjectURL(file);
				setSelectedImage(imageUrl);
				setSelectedFile(file);
				const newErrors = { ...errors };
				delete newErrors.image;
				setErrors(newErrors);
			} catch (error) {
				if (error instanceof ZodError) {
					setErrors((prev) => ({ 
						...prev, 
						image: error.errors[0]?.message || 'Invalid file' 
					}));
				}
			}
		}
	};

	useEffect(() => {
		return () => {
			if (selectedImage) {
				URL.revokeObjectURL(selectedImage);
			}
		};
	}, [selectedImage]);

	const prepareFormData = () => {
		const formDataToSend = new FormData();
		if (isEdit) formDataToSend.append('id', formData.id.toString());
		formDataToSend.append('title', formData.title);
		formDataToSend.append('publishingYear', formData.publishingYear.toString());
		formDataToSend.append('description', formData.description || '');
		formDataToSend.append('userId', user?.id?.toString() || '0');
		if (selectedFile) {
			formDataToSend.append('image', selectedFile);
		}
		return formDataToSend;
	}

	const validateForm = (): boolean => {
		try {
			movieSchema.parse(formData);
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

	const handleSubmit = async () => {
		if (!validateForm()) {
			return;
		}

		if (!isEdit && !selectedFile) {
			setErrors(prev => ({
				...prev,
				image: 'Image is required'
			}));
			return;
		}

		try {
			if (isEdit) {
				const formDataToSend = prepareFormData();
				await updateMutation.mutateAsync(formDataToSend);
			} else {
				const formDataToSend = prepareFormData();
				await createMutation.mutateAsync(formDataToSend);
			}
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		name: keyof MovieFormData
	) => {
		const { value } = e.target;
		setFormData({ ...formData, [name]: name === 'publishingYear' ? Number(value) : value });
	};

	const handleDelete = async () => {
		try {
			await deleteMutation.mutateAsync(formData.id);
		} catch (error) {
			console.error('Error deleting movie:', error);
		}
	};

	return (
		<Box>
			<StyledGrid container spacing={2} >

				
					{isMobile && <Grid container spacing={2} size={12} mt={2}>
							<Grid size={6}>
								<Button component={Link} href='/movies' variant='outlined' size='large' fullWidth>Cancel</Button>
							</Grid>
							<Grid size={6}>
								<Button variant='contained' color='primary' size='large' fullWidth onClick={handleSubmit}>{isEdit ? 'Update' : 'Sumbit'}</Button>
							</Grid>
							{isEdit &&  <Grid size={12}>
								<Button variant='contained' color='error' size='large' fullWidth onClick={handleDelete}>Delete</Button>
							</Grid>}
						</Grid>}
			
				<Grid size={{xs: 12, md: 6}}>
					<Dropzone onDrop={handleDrop}>
						{({getRootProps, getInputProps}) => (
							<StyledSection borderColor={errors.image ? '#d32f2f' : '#E0E0E0'}>
								<StyledSectionItem {...getRootProps()} >
									<input {...getInputProps()} />
									{selectedImage ? (
										<Image 
											src={selectedImage} 
											alt="Selected" 
											fill
											style={{ objectFit: 'contain' }}
										/>
									) : (
										<StyledBox>
											<Image src={downloadIcon} alt='download' />
											<Typography fontSize={14}>Drop an image here</Typography>
										</StyledBox>
									)}
								</StyledSectionItem>
							</StyledSection>
						)}
					</Dropzone>
					{errors.image && (
						<Typography color="error" variant="caption" sx={{ mt: 1 }}>
							{errors.image}
						</Typography>
					)}
				</Grid>
				<Grid size={{xs: 12, md: 6}}>
					<StyledForm >
						<FormControl sx={{width: '100%'}}>
							<TextField 
								label="Title" 
								size='medium' 
								value={formData.title} 
								onChange={(e) => handleChange(e, 'title')}
								error={!!errors.title}
								helperText={errors.title}
							/>
						</FormControl>
						<FormControl sx={{width: '100%'}}>
							<TextField 
								label="Description" 
								size='medium' 
								value={formData.description} 
								onChange={(e) => handleChange(e, 'description')}
								error={!!errors.description}
								helperText={errors.description}
							/>
						</FormControl>
						<FormControl>
							<TextField 
								label="Publishing year" 
								size='medium' 
								value={formData.publishingYear} 
								onChange={(e) => handleChange(e, 'publishingYear')}
								error={!!errors.publishingYear}
								helperText={errors.publishingYear}
							/>
						</FormControl>
						{!isMobile && <Grid container spacing={2} size={12}>
							<Grid size={6}>
								<Button component={Link} href='/movies' variant='outlined' size='large' fullWidth>Cancel</Button>
							</Grid>
							<Grid size={6}>
								<Button variant='contained' color='primary' size='large' fullWidth onClick={handleSubmit}>{isEdit ? 'Update' : 'Sumbit'}</Button>
							</Grid>
							{isEdit &&  <Grid size={12}>
								<Button variant='contained' color='error' size='large' fullWidth onClick={handleDelete}>Delete</Button>
							</Grid>}
						</Grid>}
					</StyledForm>
				</Grid>
			</StyledGrid>
		</Box>
	);
};

const StyledSection = styled('section')<{ borderColor: string }>(({ theme, borderColor }) => ({
	height: '500px', 
	width: '475px', 
	border: `2px dashed ${borderColor}`, 
	borderRadius: '10px',
	maxWidth: '100%',
	[theme.breakpoints.down('md')]: {
		height: '372px', 
		width: '100%',
	}
}));

const StyledSectionItem = styled('div')(({ theme }) => ({
	height: '100%', 
	width: '100%', 
	display: 'flex', 
	flexDirection: 'column',
	justifyContent: 'center', 
	alignItems: 'center', 
	cursor: 'pointer', 
	backgroundColor: theme.palette.background.default,
	position: 'relative'
}));

const StyledBox = styled(Box)(() => ({
	display: 'flex', 
	flexDirection: 'column', 
	justifyContent: 'center', 
	alignItems: 'center', 
	gap: '8px'
}));

const StyledForm = styled(Box)(({ theme }) => ({
	display: 'flex', 
	flexDirection: 'column', 
	justifyContent: 'flex-start', 
	alignItems: 'flex-start', 
	height: '100%', 
	gap: '40px', 
	width: '362px', 
	maxWidth: '100%',
	[theme.breakpoints.down('md')]: {
		width: '100%',
	}
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
	[theme.breakpoints.down('md')]: {
		flexDirection: 'column-reverse',
	}
}));

export default MovieForm;
interface MovieFormProps {
	movie?: Movie;
}

