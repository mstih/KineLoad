export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

// Validate email
export function validateEmailAddress(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.trim() === '') {
        return {
            valid: false,
            errors: ["Email is required!"]
        }
    } else if (!emailRegex.test(email)) {
        return {
            valid: false,
            errors: ["Invalid email format!"]
        }
    }

    return {
        valid: true,
        errors: []
    }
}

// Validate password
export function validatePassword(password: string): ValidationResult {
    if (!password || password.length === 0) {
        return {
            valid: false,
            errors: ['Password is required!']
        }
    } else if (password.length < 8) {
        return {
            valid: false,
            errors: ['Password must be at least 8 characters long!']
        }
    }
    return {
        valid: true,
        errors: []
    }
}

