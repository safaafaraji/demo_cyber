import PropTypes from 'prop-types';
import './Button.css';

const Button = ({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled = false, className = '', ...props }) => {
    return (
        <button
            type={type}
            className={`btn btn-${variant} btn-${size} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'outline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    disabled: PropTypes.bool,
    className: PropTypes.string,
};

export default Button;
