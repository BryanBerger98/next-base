export const getStringSlashedDateFromDate = (date, locale) => {
    const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const y = date.getFullYear()
    return locale === 'fr' ? `${d}/${m}/${y}` : locale === 'en' ? `${m}/${d}/${y}` : ''
}