import axios from 'axios';
import { $authHost, $host } from '.';
import { setCookie } from 'cookies-next';

export const register = async (email: string, password: string) => {
	try {
		const { data } = await $host.post('/auth/registration', { email, password });
		if (data.token) {
			setCookie('token', data.token);
		}
		return data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data.message || 'Registration failed');
		}
		throw error;
	}
};

export const login = async (email: string, password: string) => {
	try {
		const { data } = await $host.post('/auth/login', { email, password });
		if (data.token) {
			setCookie('token', data.token);
		}
		return data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Login error:', error.response?.data);
			throw new Error(error.response?.data.message || 'Login failed');
		}
		throw error;
	}
};

export const getMovies = async (offset: number = 0, limit: number = 10) => {
	try {
		const { data } = await $authHost.get('/movies', {
			params: {
				offset,
				limit
			}
		});
		return data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data.message || 'Failed to fetch movies');
		}
		throw error;
	}
};

export const getMovie = async ( id: string, limit: number = 10, offset: number = 0) => {
	const { data } = await $authHost.get(`/movies/${id}`, {
		params: {
			limit,
			offset
		}
	});
	return data;
};

export const createMovie = async (formData: FormData) => {
	const { data } = await $authHost.post('/movies', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return data;
};
export const updateMovie = async (formData: FormData) => {
	const { data } = await $authHost.patch(`/movies/${formData.get('id')}`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return data;
};

export const deleteMovie = async (id: number) => {
	const { data } = await $authHost.delete(`/movies/${id}`);
	return data;
};

export const uploadImage = async (image: File) => {
	const { data } = await $authHost.post('/upload', image);
	return data;
};

export const getProfile = async () => {
	const { data } = await $authHost.get('/auth/profile');
	return data;
};
