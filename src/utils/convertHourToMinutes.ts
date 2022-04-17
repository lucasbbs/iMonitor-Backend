export function convertHourToMinutes(time: string) {
  const [hour, minutes] = time.split(':').map(Number);
  const timeInMinutes = hour * 60 + minutes;

  return timeInMinutes;
}

export function convertMinuteToHours(time: number) {
  const hours = String(Math.floor(time / 60)).padStart(2, '0');
  const minutes = String(time % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}
