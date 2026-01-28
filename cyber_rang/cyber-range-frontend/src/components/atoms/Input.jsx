import PropTypes from 'prop-types';
import './Input.css';

const Input = ({ label, type = 'text', error, id, ...props }) => {
    return (
        <div className="input-group">
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <input
                id={id}
                type={type}
                className={`input ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    error: PropTypes.string,
    id: PropTypes.string.isRequired,
};

export default Input;
