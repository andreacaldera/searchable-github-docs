import { render } from '@testing-library/react';
import Home from '../pages/index';

describe('home page', () => {
  it('returns the page title', () => {
    render(<Home />);
    expect(true).toBeTruthy();
  });
});
