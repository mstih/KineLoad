// Functions to calculate load

// Total volume and load for strength
// Volume = sessions * exercises * reps * sets
// load = exercises * reps * sets * intensity
export function calculateStrengthVolume(
    sessions: number,
    exercises: number,
    reps: number,
    sets: number
): number {
    return sessions * exercises * reps * sets;
}

export function calculateStrengthLoad(
    exercises: number,
    reps: number,
    sets: number,
    intensity: number
): number {
    return exercises * reps * sets * intensity;
}


// Calculate volume and load for endurance
// volume = sessions * durationMin
// load = duratonMin * intensity
export function calculateEnduranceVolume(
    sessions: number,
    duration_min: number,
): number {
    return sessions * duration_min;
}

export function calculateEnduranceLoad(
    duration_min: number,
    intensity: number
): number {
    return duration_min * intensity
}


// Calculate volume for flexibility
// volume = sessions * exercises * sets * holdSeconds
// load = exercises * sets * holdSeconds
export function calculateFlexibilityVolume(
    sessions: number,
    exercises: number,
    sets: number,
    hold_seconds: number
): number {
    return sessions * exercises * sets * hold_seconds
}

export function calculateFlexibilityLoad(
    exercises: number,
    sets: number,
    hold_seconds: number
): number {
    return exercises * sets * hold_seconds
}


// Total weekly load (all of three together)
// total load = strength load + endurance load + flexibility load
export function calculateTotalWeeklyLoad(
    strength: { sessions: number; exercises: number; reps: number; sets: number; intensity: number } | null,
    endurance: { sessions: number; duration_min: number; intensity: number } | null,
    flexibility: { sessions: number; exercises: number; sets: number; hold_seconds: number } | null
): number {
    let total = 0;
    if (strength) {
        total += calculateStrengthLoad(strength.sessions, strength.reps, strength.sets, strength.intensity)
    }
    if (endurance) {
        total += calculateEnduranceLoad(endurance.duration_min, endurance.intensity)
    }
    if (flexibility) {
        total += calculateFlexibilityLoad(flexibility.exercises, flexibility.sets, flexibility.hold_seconds)
    }
    return total;
}