import React from 'react';
import { PageId, ThemeMode } from '../../types';
import { Home } from '../../pages/Home';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  theme?: ThemeMode;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, theme }) => {
  return <Home onNavigate={onNavigate} theme={theme} />;
};
