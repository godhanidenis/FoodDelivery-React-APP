import moment from 'moment'

export function format_hours(decimal_hours, parts, show_seconds) {
    parts = parts || convert_hours_to_parts(decimal_hours)
    let {hours, minutes, seconds} = parts

    if ( show_seconds === true ) {
        let str = ""
        if ( hours > 0 ) {
            str += hours + "h "
        }
        str += minutes + "m "
        str += seconds + "s "

        return str
        
    } else {
        if (hours   < 10 && hours >= 0) {hours   = "0"+hours}
        if (seconds < 10 && seconds >= 0) {seconds = "0"+seconds}
        if (minutes < 10 && minutes >= 0) {minutes = "0"+minutes}
        return hours+':'+minutes
    }
}

export function convert_hours_to_parts(hours) {
    if ( ! hours ) {
        hours = 0
    }
    const raw_seconds = hours*60*60
    var sec_num = parseInt(raw_seconds, 10)
    hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    var seconds = sec_num - (hours * 3600) - (minutes * 60)
    return {hours: hours, minutes:minutes, seconds:seconds}
}
