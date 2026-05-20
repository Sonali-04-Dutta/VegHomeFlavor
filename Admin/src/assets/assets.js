import logo from './logo.png'
import add_icon from './add_icon.png'
import order_icon from './order_icon.png'
import profile_image from './profile_image.jpg'
import upload_area from './upload_area.png'
import parcel_icon from './parcel_icon.png'
import icon2 from './icon2.png'
// import veghome from './home.png'
import home from './home.png'

export const assets ={
    logo,
    add_icon,
    order_icon,
    profile_image,
    upload_area,
    parcel_icon,
    icon2,
    home
}

const getApiBaseUrl = () => {
    const envApiUrl = import.meta.env.VITE_API_URL

    if (envApiUrl) {
        return envApiUrl
    }

    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        return 'https://veghomeflavor.onrender.com'
    }

    return 'http://localhost:4000'
}

export const url = getApiBaseUrl().replace(/\/+$/, '')
