// TODO: yes, well types
// Basically similar to database schema

// User types
export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: string;
}

export interface UserPublic {
    id: number;
    name: string;
    email: string;
}


// Session type
export interface Session {
    id: number;
    user_id: number;
    token: string;
    expires_at: string;
    created_at: string;
}

// Plan type
export interface Plan {
    id: number;
    user_id: number;
    name: string;
    start_date: string;
    weeks: number;
    created_at: string;
}


// Week type
export interface Week {
    id: number;
    plan_id: number;
    week_number: number;
}


// Strength entry type
export interface StrengthEntry {
    id: number;
    week_id: number;
    sessions: number;
    intensity: number;
    exercises: number;
    reps: number;
    sets: number;
}


// Endurance entry type
export interface EnduranceEntry {
    id: number;
    week_id: number;
    sessions: number;
    intensity: number;
    duration_min: number;
}


// Flexibility entry type
export interface FlexibilityEntry {
    id: number;
    week_id: number;
    sessions: number;
    exercises: number;
    sets: number;
    hold_seconds: number;
}