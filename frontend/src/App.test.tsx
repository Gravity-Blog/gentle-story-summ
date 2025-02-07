import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders app', () => {
  render(<App />);
  const appElement = screen.getByRole('main');
  expect(appElement).toBeInTheDocument();
});
