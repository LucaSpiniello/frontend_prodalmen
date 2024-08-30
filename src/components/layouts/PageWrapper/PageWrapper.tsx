import React, { FC, ReactNode, useEffect } from 'react';
import classNames from 'classnames';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import { authPages } from '../../../config/pages.config';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import Cookies from 'js-cookie'

interface IPageWrapperProps {
	children: ReactNode;
	className?: string;
	isProtectedRoute?: boolean;
	title?: string;
	name?: string;
}
const PageWrapper: FC<IPageWrapperProps> = (props) => {
	const { children, className, isProtectedRoute, title, name, ...rest } = props;
	const navigate = useNavigate()

	useDocumentTitle({ title, name });
	const token_cookie = Cookies.get('token')
	const { pathname } = useLocation()
	const token_redux = useAppSelector((state: RootState) => state.auth.authTokens)
	const perfil = useAppSelector((state: RootState) => state.auth.dataUser)


	useEffect(() => {

		if (pathname === '/' && token_cookie !== undefined){
			navigate('/home/dashboard', { replace: true })
		}
		
		if (pathname === '/login' && token_cookie !== undefined && perfil){
			navigate('/home/dashboard', { replace: true })
		}

	
		if (isProtectedRoute && token_cookie === undefined && !perfil){
			navigate('/login', { replace: true })
		} 

		return () => {}
	}, [token_cookie, pathname])


	return (
		<main
			data-component-name='PageWrapper'
			className={classNames('flex shrink-0 grow flex-col', className)}
			{...rest}>
			{children}
		</main>
	);
};
PageWrapper.defaultProps = {
	className: undefined,
	isProtectedRoute: true,
	title: undefined,
	name: undefined,
};

export default PageWrapper;
