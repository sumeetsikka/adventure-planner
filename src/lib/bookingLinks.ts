/**
 * Generate real booking deep links for flights, hotels, and car hire.
 * No API keys needed. These open the booking site with search pre-filled.
 */

function formatDateSky(dateStr: string): string {
  // Skyscanner uses YYMMDD format
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${y.slice(2)}${m}${d}`;
}

function formatDateBooking(dateStr: string): string {
  // Booking.com uses YYYY-MM-DD
  return dateStr;
}

export function getFlightLinks(
  fromCode: string,
  toCode: string,
  date: string,
  returnDate?: string,
  adults: number = 2,
  children: number = 0,
): Record<string, string> {
  const from = fromCode.toLowerCase();
  const to = toCode.toLowerCase();
  const outDate = formatDateSky(date);
  const retDate = returnDate ? formatDateSky(returnDate) : '';

  // Skyscanner
  const skyBase = `https://www.skyscanner.com.au/transport/flights/${from}/${to}/${outDate}`;
  const skyUrl = retDate
    ? `${skyBase}/${retDate}/?adults=${adults}&children=${children}`
    : `${skyBase}/?adults=${adults}&children=${children}`;

  // Google Flights
  const gfDate = date;
  const gfUrl = `https://www.google.com/travel/flights?q=flights+from+${fromCode}+to+${toCode}+on+${gfDate}&curr=AUD`;

  // Webjet (Australian)
  const wjUrl = `https://www.webjet.com.au/flights/${fromCode}-to-${toCode}/${date}/`;

  return {
    'Skyscanner': skyUrl,
    'Google Flights': gfUrl,
    'Webjet': wjUrl,
  };
}

export function getHotelLinks(
  destination: string,
  checkin: string,
  checkout: string,
  adults: number = 2,
  rooms: number = 1,
): Record<string, string> {
  const dest = encodeURIComponent(destination);

  // Booking.com
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${dest}&checkin=${formatDateBooking(checkin)}&checkout=${formatDateBooking(checkout)}&group_adults=${adults}&no_rooms=${rooms}`;

  // Agoda
  const agodaUrl = `https://www.agoda.com/search?city=${dest}&checkIn=${formatDateBooking(checkin)}&checkOut=${formatDateBooking(checkout)}&rooms=${rooms}&adults=${adults}`;

  // Hotels.com
  const hotelsUrl = `https://www.hotels.com/search.do?q-destination=${dest}&q-check-in=${formatDateBooking(checkin)}&q-check-out=${formatDateBooking(checkout)}&q-rooms=1&q-room-0-adults=${adults}`;

  // Skyscanner Hotels
  const skyHotelUrl = `https://www.skyscanner.com.au/hotels/search?entity_id=${dest}&checkin=${formatDateBooking(checkin)}&checkout=${formatDateBooking(checkout)}&adults=${adults}&rooms=${rooms}`;

  return {
    'Booking.com': bookingUrl,
    'Agoda': agodaUrl,
    'Hotels.com': hotelsUrl,
    'Skyscanner': skyHotelUrl,
  };
}
