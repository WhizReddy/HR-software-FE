export const greeter = () => {
    const currDate = new Date()
    const hours = currDate.getHours()

    if (hours >= 5 && hours < 12) {
        return 'Good Morning'
    } else if (hours >= 12 && hours < 19) {
        return 'Good Afternoon'
    } else {
        return 'Good Evening'
    }
}
