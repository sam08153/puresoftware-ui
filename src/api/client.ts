export const API_BASE = 'http://localhost:8080';

export type EventDto = {
  id: number;
  title: string;
  category: string;
  city: string;
  eventDateTime: string;
};

export type SeatDto = {
  id: number;
  rowLabel: string;
  seatNumber: number;
  tier: string;
  price: number;
  status: 'AVAILABLE' | 'HELD' | 'BOOKED';
};

export async function fetchEvents(params: {city?: string; category?: string}) {
  const qp = new URLSearchParams(params as Record<string, string>);
  const res = await fetch(`${API_BASE}/events?${qp.toString()}`);
  if (!res.ok) throw new Error('Failed to load events');
  return (await res.json()) as EventDto[];
}

export async function fetchSeats(eventId: number) {
  const res = await fetch(`${API_BASE}/events/${eventId}/seats`);
  if (!res.ok) throw new Error('Failed to load seats');
  return (await res.json()) as SeatDto[];
}

export async function reserve(eventId: number, userId: number, seatIds: number[]) {
  const res = await fetch(`${API_BASE}/bookings/reserve`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({eventId, userId, seatIds}),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({message: 'Failed to reserve seats'}));
    throw new Error(errorData.message || 'Failed to reserve seats');
  }
  return (await res.json()) as {reservationId: string; expiresAt: string};
}

export async function confirm(reservationId: string, userId: number, paymentReference: string) {
  const res = await fetch(`${API_BASE}/bookings/confirm`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({reservationId, userId, paymentReference}),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({message: 'Failed to confirm booking'}));
    throw new Error(errorData.message || 'Failed to confirm booking');
  }
  return (await res.json()) as number;
}

