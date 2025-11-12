// Simple validation middleware without express-validator dependency
exports.handleValidationErrors = (validations) => {
    return (req, res, next) => {
        const errors = [];
        
        for (const validation of validations) {
            const { field, required, type, message } = validation;
            const value = req.body[field];
            
            if (required && (value === undefined || value === null || value === '')) {
                errors.push({ field, message: message || `${field} is required` });
            }
            
            if (value !== undefined && value !== null && type) {
                if (type === 'number' && typeof value !== 'number') {
                    errors.push({ field, message: `${field} must be a number` });
                }
                if (type === 'string' && typeof value !== 'string') {
                    errors.push({ field, message: `${field} must be a string` });
                }
                if (type === 'array' && !Array.isArray(value)) {
                    errors.push({ field, message: `${field} must be an array` });
                }
            }
        }
        
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        
        next();
    };
};
