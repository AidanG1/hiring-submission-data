import { render, screen } from '@testing-library/react';
import App from './App';

test('renders tabs', () => {
  render(<App />);
  const linkElement = screen.getByText('Traffic Change');
  expect(linkElement).toBeInTheDocument();
  const linkElement2 = screen.getByText('Popular Domains');
  expect(linkElement2).toBeInTheDocument();
  const linkElement3 = screen.getByText('Layer 3');
  expect(linkElement3).toBeInTheDocument();
  const linkElement4 = screen.getByText('About');
  expect(linkElement4).toBeInTheDocument();
});

test('renders traffic change', () => {
  render(<App />);
  const linkElement = screen.getByText('Traffic Change Over Time');
  expect(linkElement).toBeInTheDocument();
});

test('renders popular domains', () => {
  render(<App />);
  const linkElement = screen.getByText('Popular Domains');
  expect(linkElement).toBeInTheDocument();
  const linkElement2 = screen.getByText('google.com');
  expect(linkElement2).toBeInTheDocument();
});

test('renders layer 3', () => {
  render(<App />);
  const linkElement = screen.getByText('Layer 3 Percentage Over Time');
  expect(linkElement).toBeInTheDocument();
});