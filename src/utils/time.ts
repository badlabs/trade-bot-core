export function addSecondsToDate(date: Date, seconds: number): Date{
  return new Date(date.getTime() + 1000 * seconds)
}

export function addMinutesToDate(date: Date, minutes: number): Date{
  return new Date(date.getTime() + 60_000 * minutes)
}

export function addHoursToDate(date: Date, hours: number): Date{
  return new Date(date.getTime() + 60_000 * 60 * hours)
}

export function addDaysToDate(date: Date, days: number): Date{
  return new Date(date.getTime() + 60_000 * 60 * 24 * days)
}
