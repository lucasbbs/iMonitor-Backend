"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMinuteToHours = exports.convertHourToMinutes = void 0;
function convertHourToMinutes(time) {
    const [hour, minutes] = time.split(':').map(Number);
    const timeInMinutes = hour * 60 + minutes;
    return timeInMinutes;
}
exports.convertHourToMinutes = convertHourToMinutes;
function convertMinuteToHours(time) {
    const hours = String(Math.floor(time / 60)).padStart(2, '0');
    const minutes = String(time % 60).padStart(2, '0');
    return `${hours}:${minutes}`;
}
exports.convertMinuteToHours = convertMinuteToHours;
