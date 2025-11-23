const API_BASE_URL = "https://jsonplaceholder.typicode.com/posts";
const API_KEY = "your-api-key-here";
const TIMEOUT = 5000;
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';
const TOKEN_KEY = 'app_access_token';
const REFRESH_KEY = 'app_refresh_token';

export { API_BASE_URL, API_KEY, TIMEOUT,API_BASE, TOKEN_KEY, REFRESH_KEY };