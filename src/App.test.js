import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Cannabis Store Vienna heading', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /cannabis store vienna/i })
  ).toBeInTheDocument();
});
