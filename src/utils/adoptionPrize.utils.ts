export const ADOPTION_DURATIONS = {
    1: { label: '1 Tahun', multiplier: 1.0 },
    3: { label: '3 Tahun', multiplier: 1.5 },
} as const

export type DurationYears = keyof typeof ADOPTION_DURATIONS

export function calculatePrice(basePrice: number, duration: DurationYears): number {
    return basePrice * ADOPTION_DURATIONS[duration].multiplier
}

export function calculateExpiresAt(adoptedAt: Date, duration: DurationYears): Date {
    const expiresAt = new Date(adoptedAt)
    expiresAt.setFullYear(expiresAt.getFullYear() + duration)
    return expiresAt
}

export function isValidDuration(value: number): value is DurationYears {
    return value in ADOPTION_DURATIONS
}