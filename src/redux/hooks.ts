import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { ThunkDispatch } from '@reduxjs/toolkit';

// Hooks personalizados para usar en la aplicación
export const useAppDispatch = () => useDispatch<ThunkDispatch<RootState, any, any>>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;