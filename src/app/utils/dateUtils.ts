/**
 * Format a date string to a human-readable format
 * @param dateString Date string in ISO format
 * @param includeTime Whether to include time in the formatted date
 * @returns Formatted date string
 */
export function formatDate(dateString: string, includeTime: boolean = false): string {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString; // Return the original string if it's not a valid date
    }
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Format a date range
 * @param startDate Start date string
 * @param endDate End date string
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate && !endDate) return '-';
  if (!startDate) return `Until ${formatDate(endDate)}`;
  if (!endDate) return `From ${formatDate(startDate)}`;
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Get relative time from now
 * @param dateString Date string in ISO format
 * @returns Relative time string (e.g., "2 days ago")
 */
export function getRelativeTime(dateString: string): string {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSec = Math.floor(diffInMs / 1000);
    const diffInMin = Math.floor(diffInSec / 60);
    const diffInHour = Math.floor(diffInMin / 60);
    const diffInDay = Math.floor(diffInHour / 24);
    const diffInMonth = Math.floor(diffInDay / 30);
    
    if (diffInSec < 60) {
      return 'just now';
    } else if (diffInMin < 60) {
      return `${diffInMin} minute${diffInMin > 1 ? 's' : ''} ago`;
    } else if (diffInHour < 24) {
      return `${diffInHour} hour${diffInHour > 1 ? 's' : ''} ago`;
    } else if (diffInDay < 30) {
      return `${diffInDay} day${diffInDay > 1 ? 's' : ''} ago`;
    } else if (diffInMonth < 12) {
      return `${diffInMonth} month${diffInMonth > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return dateString;
  }
} 