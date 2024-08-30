import { useEffect, useState } from 'react';
import axios, { AxiosHeaders, Method, RawAxiosRequestHeaders } from 'axios';

const axiosInstanceDefault = axios.create({
	//@ts-ignore
	baseURL: process.env.VITE_BASE_URL,
	headers: { 'Content-Type': 'application/json' },
});

const useAxiosFunction = () => {
	const [response, setResponse] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [controller, setController] = useState();

	const axiosFetch = async (configObj: {
		axiosInstance: { baseURL: string; headers: RawAxiosRequestHeaders | AxiosHeaders };
		method: Method;
		url: string;
		// eslint-disable-next-line @typescript-eslint/ban-types
		requestConfig?: {};
	}) => {
		const { axiosInstance = axiosInstanceDefault, method, url, requestConfig = {} } = configObj;

		try {
			setLoading(true);
			const ctrl = new AbortController();
			// @ts-ignore
			setController(ctrl);
			// @ts-ignore
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
			const res = await axiosInstance[method.toLowerCase()](url, {
				...requestConfig,
				signal: ctrl.signal,
			});
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
			setResponse(res.data);
		} catch (err) {
			// @ts-ignore
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		return () => controller && controller.abort();
	}, [controller]);

	return [response, error, loading, axiosFetch];
};

export default useAxiosFunction;
