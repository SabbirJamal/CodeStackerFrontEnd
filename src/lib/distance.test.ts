import { haversineDistance, totalRouteDistance, calculateDetour } from './distance';

const muscat = { lat: 23.5880, lng: 58.3829 };
const nizwa = { lat: 22.9333, lng: 57.5333 };

const sur = { lat: 22.5667, lng: 59.5289 };
const wahiba = { lat: 22.5000, lng: 58.8000 };

console.log('=== Distance Calculator Test ===');
console.log('Muscat to Nizwa:', haversineDistance(muscat, nizwa).toFixed(1), 'km');
console.log('Sur to Wahiba Sands:', haversineDistance(sur, wahiba).toFixed(1), 'km');

const route = [muscat, nizwa, sur];
console.log('Total route distance:', totalRouteDistance(route).toFixed(1), 'km');

const detour = calculateDetour([muscat, sur], wahiba, 1);
console.log('Detour penalty adding Wahiba between Muscat and Sur:', detour.toFixed(1), 'km');