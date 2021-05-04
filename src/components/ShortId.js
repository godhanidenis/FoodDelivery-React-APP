
export const ShortId = ({ value, ...props }) => {
    if ( ! value ) {
        return ""
    }
    return (
        value.slice(value, 6)
    )
}
