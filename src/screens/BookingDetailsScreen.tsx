import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {getBooking, BookingDto, fetchEvent} from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingDetails'>;

export default function BookingDetailsScreen({route}: Props) {
  const {bookingId} = route.params;
  const [booking, setBooking] = useState<BookingDto | null>(null);
  const [eventTitle, setEventTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (s?: string) => {
    if (!s) return '';
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d.toLocaleString();
    const withZ = s.endsWith('Z') ? s : s + 'Z';
    const d2 = new Date(withZ);
    if (!isNaN(d2.getTime())) return d2.toLocaleString();
    const trimmed = s.replace(/\.(\d{3})\d+/, '.$1');
    const d3 = new Date(trimmed);
    if (!isNaN(d3.getTime())) return d3.toLocaleString();
    return '';
  };

  useEffect(() => {
    setLoading(true);
    getBooking(bookingId)
      .then(async b => {
        setBooking(b);
        const e = await fetchEvent(b.eventId);
        setEventTitle(e.title);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <ActivityIndicator style={{margin: 16}} />;
  if (error) return <Text style={{margin: 16}}>Error: {error}</Text>;
  if (!booking) return null;

  return (
    <View style={{padding: 16}}>
      <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 8}}>Booking #{booking.id}</Text>
      <Text style={{marginBottom: 4}}>Event: {eventTitle || booking.eventId}</Text>
      <Text style={{marginBottom: 4}}>Seats: {booking.seatIds.join(', ')}</Text>
      <Text style={{marginBottom: 4}}>Status: {booking.status}</Text>
      <Text>Booked At: {formatDate(booking.bookedAt)}</Text>
    </View>
  );
}
