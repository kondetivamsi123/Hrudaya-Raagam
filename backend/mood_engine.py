def get_mood_from_bpm(bpm: int) -> str:
    """
    Determine mood based on BPM.
    Ranges per SRS:
    60-75: Melody (Relaxing) - previously Sad
    76-95: Happy/Sustain
    >95: Mass/Energetic
    """
    if bpm < 60:
        return "Melody" # Handle low BPM
    elif 60 <= bpm <= 75:
        return "Melody"
    elif 76 <= bpm <= 95:
        return "Happy"
    elif bpm > 95:
        return "Mass"
    return "Happy" # Default fallback
