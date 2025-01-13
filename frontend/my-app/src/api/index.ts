import axios, { InternalAxiosRequestConfig } from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';

const $host = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

const $authHost = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

const authInterceptor = (config: InternalAxiosRequestConfig) => {
	const token = getCookie('token');
	if (config.headers && token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
};

$authHost.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			deleteCookie('token');
			window.location.href = '/';
		}
		return Promise.reject(error);
	}
);

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
