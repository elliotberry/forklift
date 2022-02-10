/**
 * Calculates and returns a string representing the time elapsed since a given date.
 *
 * @param {Date|string|number} data - The date to compare against the current time. Can be a Date object, a timestamp, or a string that can be parsed into a date.
 * @param {Object} [options] - Configuration options for formatting the output.
 * @param {boolean} [options.compact=false] - If true, returns a compact representation of the time difference.
 * @param {Object} [options.customStrings={}] - Object containing custom strings to override default language strings.
 * @param {string} [options.granularity='auto'] - Determines the level of detail in the output. Options: 'auto', 'detailed'.
 * @returns {string|null} A string representing the time difference (e.g., "2 days ago") or null if no date is provided.
 *
 * @example
 * const date = new Date('2023-01-01T12:00:00Z');
 * const result = timeAgo(date);
 * console.log(result); // Output could be "9 months ago" depending on the current date.
 *
 * @example
 * const timestamp = 1672444800000; // January 1, 2023
 * const result = timeAgo(timestamp, { compact: true });
 * console.log(result); // Output could be "9mo" depending on the current date.
 *
 * @example
 * const invalidDate = 'not_a_date';
 * const result = timeAgo(invalidDate);
 * console.log(result); // Output: ''
 */
const timeAgo = (
  data,
  options = {
    compact: false,
    customStrings: {},
    granularity: "auto" // options: 'auto', 'detailed'
  }
) => {
  if (!data) return null

  // Convert string date to timestamp
  if (typeof data === "string") {
    const parsedDate = Date.parse(data)
    if (isNaN(parsedDate)) {
      console.error("Error with timeAgo: Invalid date")
      return ""
    }
    data = parsedDate
  }

  const now = Date.now()
  const difference = Math.round((now - data) / 1000)

  // Language strings with defaults, can be overridden by custom strings
  const langStrings = {
    daysAgo: "days ago",
    hourAgo: "1 hour ago",
    hoursAgo: "hours ago",
    inFuture: "in the future",
    justNow: "just now",
    justNowCompact: "now",
    minuteAgo: "1 minute ago",
    minutesAgo: "minutes ago",
    monthAgo: "1 month ago",
    monthsAgo: "months ago",
    secondsAgo: "seconds ago",
    weekAgo: "1 week ago",
    weeksAgo: "weeks ago",
    yearAgo: "1 year ago",
    yearsAgo: "years ago",
    yesterday: "Yesterday",
    ...options.customStrings
  }

  const thresholds = {
    century: 3_153_600_000, // 100 years
    day: 86_400,
    decade: 315_360_000, // 10 years
    hour: 3600,
    minute: 60,
    month: 2_592_000, // 30 days
    week: 604_800,
    year: 31_536_000 // 365 days
  }

  const getUnits = () => {
    if (Math.abs(difference) < thresholds.minute)
      return { unit: "seconds", value: difference }
    if (Math.abs(difference) < thresholds.hour)
      return {
        unit: "minutes",
        value: Math.round(difference / thresholds.minute)
      }
    if (Math.abs(difference) < thresholds.day)
      return { unit: "hours", value: Math.round(difference / thresholds.hour) }
    if (Math.abs(difference) < thresholds.week)
      return { unit: "days", value: Math.round(difference / thresholds.day) }
    if (Math.abs(difference) < thresholds.month)
      return { unit: "weeks", value: Math.round(difference / thresholds.week) }
    if (Math.abs(difference) < thresholds.year)
      return {
        unit: "months",
        value: Math.round(difference / thresholds.month)
      }
    if (Math.abs(difference) < thresholds.decade)
      return { unit: "years", value: Math.round(difference / thresholds.year) }
    if (Math.abs(difference) < thresholds.century)
      return {
        unit: "decades",
        value: Math.round(difference / thresholds.decade)
      }
    return {
      unit: "centuries",
      value: Math.round(difference / thresholds.century)
    }
  }

  const { unit, value } = getUnits()

  if (difference < 0) {
    return options.compact ?
        `${Math.abs(value)}${unit[0]}`
      : `in ${Math.abs(value)} ${langStrings[`${unit}Ago`] || unit}`
  }

  const detailedUnitMapping = {
    centuries: `1 century ago`,
    days:
      value === 1 ? langStrings.yesterday : `${value} ${langStrings.daysAgo}`,
    decades: `1 decade ago`,
    hours:
      value === 1 ? langStrings.hourAgo : `${value} ${langStrings.hoursAgo}`,
    minutes:
      value === 1 ?
        langStrings.minuteAgo
      : `${value} ${langStrings.minutesAgo}`,
    months:
      value === 1 ? langStrings.monthAgo : `${value} ${langStrings.monthsAgo}`,
    seconds: langStrings.justNow,
    weeks:
      value === 1 ? langStrings.weekAgo : `${value} ${langStrings.weeksAgo}`,
    years:
      value === 1 ? langStrings.yearAgo : `${value} ${langStrings.yearsAgo}`
  }

  if (options.compact) {
    return value === 1 && unit === "seconds" ?
        langStrings.justNowCompact
      : `${value}${unit[0]}`
  } else if (options.granularity === "detailed") {
    return detailedUnitMapping[unit]
  } else {
    // Auto granularity
    return value === 1 && unit === "seconds" ?
        langStrings.justNow
      : `${value} ${langStrings[`${unit}Ago`] || `${unit} ago`}`
  }
}

export default timeAgo
