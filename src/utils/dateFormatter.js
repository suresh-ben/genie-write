export function formatDate(date) {
    const ordinalSuffix = (day) => {
        if (day > 3 && day < 21) return "th"; // 4th-20th always "th"
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    const options = { month: "short", day: "numeric", year: "numeric" };
    const dateObj = new Date(date);
    
    const monthDayYear = new Intl.DateTimeFormat("en-US", options).format(dateObj);
    const [month, day, year] = monthDayYear.replace(",", "").split(" ");

    return `${month} ${day}${ordinalSuffix(parseInt(day))}, ${year}`;
}