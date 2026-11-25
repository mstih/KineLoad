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


// TODO: same for endurance and flexibility