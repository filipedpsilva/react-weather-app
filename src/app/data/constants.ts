// META
export const ENV = import.meta.env;

// URLS
export const BASE_API_URL = ENV.VITE_BASE_API_URL;

// KEYS
export const API_KEY = ENV.VITE_API_KEY;
export const ACCESS_KEY = ENV.VITE_ACCESS_KEY;

// MISC
export const NOON_TIME = "12:00:00";
export const MIDNIGHT_TIME = "00:00:00";
export const HOUR_FORMAT = "HH:mm";
export const FULL_DAY_FORMAT = "YYYY-MM-DD HH:mm";

// DEVICES
export const DEVICE_SIZES = {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '2560px'
}
