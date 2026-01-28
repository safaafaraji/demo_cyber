import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
    it('renders children correctly', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        fireEvent.click(screen.getByText('Click Me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when the disabled prop is true', () => {
        render(<Button disabled>Disabled Button</Button>);
        expect(screen.getByText('Disabled Button')).toBeDisabled();
    });

    it('applies the correct variant class', () => {
        render(<Button variant="danger">Danger Button</Button>);
        expect(screen.getByText('Danger Button')).toHaveClass('btn-danger');
    });
});
