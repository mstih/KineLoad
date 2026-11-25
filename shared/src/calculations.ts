// Functions to calculate load

// Total volume for strength
// Volume = sessions * exercises * reps * sets
export function calculateStrengthVolume(
    sessions: number,
    exercises: number,
    reps: number,
    sets: number
): number {
    return sessions * exercises * reps * sets;
}

// Calculate load for strength
// load = volume * (intensity / 100)
export function calculateStrengthLoad(
    sessions: number,
    exercises: number,
    reps: number,
    sets: number,
    intensity: number
): number {
    const vol = calculateStrengthVolume(sessions, exercises, reps, sets);
    return vol * (intensity / 100);
}


// Calculate volume for endurance
export function calculateEnduranceVolume(
    sessions: number,
    duration_min: number,
): number {
    return sessions * duration_min;
}

// and load
export function calculateEnduranceLoad(
    sessions: number,
    duration_min: number,
    intensity: number
): number {
    const vol = calculateEnduranceVolume(sessions, duration_min);
    return vol * (intensity / 100);
}


// Calculate volume for flexibility
export function calculateFlexibilityVolume(
    sessions: number,
    exercises: number,
    sets: number,
    hold_seconds: number
): number {
    return sessions * exercises * sets * hold_seconds
}


// Total weekly load (all of three together)
export function calculateTotalWeeklyLoad(
    strength: { sessions: number; exercises: number; reps: number; sets: number; intensity: number } | null,
    endurance: { sessions: number; duration_min: number; intensity: number } | null,
    flexibility: { sessions: number; exercises: number; sets: number; hold_seconds: number } | null
): number {
    let total = 0;
    total += calculateStrengthLoad(strength.sessions, strength?.exercises, strength?.reps, strength?.sets, strength?.intensity)
    total += calculateEnduranceLoad(endurance?.sessions, endurance?.duration_min, endurance?.intensity)
    total += calculateFlexibilityVolume(flexibility?.sessions, flexibility?.exercises, flexibility?.sets, flexibility?.hold_seconds)
    return total;
}