// Input sanitization helpers to prevent NoSQL injection

/**
 * Sanitize string input by removing any MongoDB operators
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
exports.sanitizeString = (input) => {
    if (typeof input !== 'string') {
        return input;
    }
    
    // Remove any MongoDB operators that start with $
    return input.replace(/^\$/, '');
};

/**
 * Sanitize an object by removing any keys that start with $
 * @param {object} obj - The object to sanitize
 * @returns {object} - Sanitized object
 */
exports.sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    
    const sanitized = {};
    
    for (const [key, value] of Object.entries(obj)) {
        // Skip keys that start with $ or contain dots
        if (!key.startsWith('$') && !key.includes('.')) {
            sanitized[key] = value;
        }
    }
    
    return sanitized;
};

/**
 * Validate MongoDB ObjectId format
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid ObjectId format
 */
exports.isValidObjectId = (id) => {
    if (typeof id !== 'string') {
        return false;
    }
    
    // MongoDB ObjectId is a 24 character hex string
    return /^[0-9a-fA-F]{24}$/.test(id);
};
