// META
export const ENV = import.meta.env;

// URLS
export const BASE_API_URL = ENV.VITE_BASE_API_URL;

// KEYS
export const API_KEY = ENV.VITE_API_KEY;
export const ACCESS_KEY = ENV.VITE_ACCESS_KEY;

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
