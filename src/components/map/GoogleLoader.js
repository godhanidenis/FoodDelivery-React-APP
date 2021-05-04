// @ts-nocheck
import { useJsApiLoader } from '@react-google-maps/api'

const js_api_loader_options = {
    libraries: ["places"],
    componentRestrictions: {country: "za"}
}

export const loadGoogleApi = () => {

    // Use like this :
    // const { isLoaded, loadError } = loadGoogleApi()
    //

    const res = useJsApiLoader({
        googleMapsApiKey: window.LOCAL_SETTINGS.GOOGLE_API_KEY,
        ...js_api_loader_options
    })
    const { isLoaded, loadError } = res
    
    return  res
}


