// Shared handler logic for Vercel serverless functions
// This re-exports everything from server/lib so API functions can import from one place
export { callLLM } from '../server/lib/gemini';
export { ITINERARY_SYSTEM, FLIGHTS_SYSTEM, HOTELS_SYSTEM, BUDGET_SYSTEM, TIPS_SYSTEM, PACKING_SYSTEM, VISA_SYSTEM, CURRENCY_SYSTEM, NEARBY_SYSTEM } from '../server/lib/prompts';
export { determineEntryCity, getEntryCityName, orderDestinations, calculateRooms } from '../server/lib/routePlanner';
export { computeSchedule, formatScheduleForPrompt, fixFlightDates, fixHotelDates } from '../server/lib/dateSchedule';
