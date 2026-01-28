import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ children, title, subtitle, className = '', ...props }) => {
    return (
        <div className={`card ${className}`} {...props}>
            {(title || subtitle) && (
                <div className="card-header">
                    {title && <h3 className="card-title">{title}</h3>}
                    {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node,
    title: PropTypes.node,
    subtitle: PropTypes.node,
    className: PropTypes.string,
};

export default Card;
