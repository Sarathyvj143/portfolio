/**
 * @author Parthasarathy
 * @date 2025-05-10
 */

export const _dateUtils = {
    /**
     * @param {Date} date
     * @return {Number}
     */
    getYearsPassedSince: (date) => {
        const currentDate = new Date()
        const differenceInMilliseconds = currentDate - date
        const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000
        return differenceInMilliseconds / millisecondsPerYear
    },

    /**
     * @param date
     */
    isSameDay: (date) => {
        const currentDate = new Date()
        return date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear()
    },

    /**
     * Formats an ISO date string into a localized, human-readable date.
     * Returns an empty string for missing/invalid input.
     *
     * @param {String} dateString
     * @param {String} [locale='en']
     * @return {String}
     */
    formatLocalized: (dateString, locale = 'en') => {
        if (!dateString)
            return ""

        const date = new Date(dateString)
        if (Number.isNaN(date.getTime()))
            return ""

        return date.toLocaleDateString(locale || 'en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
}