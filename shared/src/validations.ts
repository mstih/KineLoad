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

// Validate plan input
export function validatePlan(data: {
    name: string;
    start_date: string;
    weeks: number;
}): ValidationResult {
    const errors: string[] = [];

    // no name
    if (!data.name || data.name.trim() === '') {
        errors.push('Plan name is required!')
    }

    // no start date
    if (!data.start_date) {
        errors.push('Start date is required!')
    }

    // no weeks field or not inside the bounds
    if (!data.weeks || data.weeks < 1 || data.weeks > 52) {
        errors.push('Please choose weeks between 1 and 52')
    }

    return {
        valid: errors.length === 0,
        errors
    }
}

// Validate strength entry
export function validateStrengthEntry(data: {
    sessions: number;
    intensity: number;
    exercises: number;
    reps: number;
    sets: number;
}): ValidationResult {
    const errors: string[] = [];

    if (data.sessions < 0) errors.push('Number of sessions not valid!');
    if (data.intensity < 0 || data.intensity > 100) errors.push('Intensity must be between 0 and 100!');
    if (data.exercises < 0) errors.push('Exercises cannot be negative!');
    if (data.reps < 0) errors.push('Reps cannot be negative!')
    if (data.sets < 0) errors.push('Sets cannot be negative!')

    return {
        valid: errors.length === 0,
        errors
    }
}

// Validate endurance entry
export function validateEnduranceEntry(data: {
    sessions: number;
    intensity: number;
    duration_min: number;
}): ValidationResult {
    const errors: string[] = [];

    if (data.sessions < 0) errors.push('Number of sessions not valid!');
    if (data.intensity < 0 || data.intensity > 100) errors.push('Intensity must be between 0 and 100!');
    if (data.duration_min < 0) errors.push('Duration cannot be negative!');

    return {
        valid: errors.length === 0,
        errors
    }
}

// Validate flexibility entry
export function validateFlexibilityEntry(data: {
    sessions: number;
    exercises: number;
    sets: number;
    hold_seconds: number
}): ValidationResult {
    const errors: string[] = [];

    if (data.sessions < 0) errors.push('Number of sessions not valid!');
    if (data.exercises < 0) errors.push('Number of exercises not valid!');
    if (data.sets < 0) errors.push('Number of sets not valid!');
    if (data.hold_seconds < 0) errors.push('Number of seconds is not valid!');

    return {
        valid: errors.length === 0,
        errors
    }
}