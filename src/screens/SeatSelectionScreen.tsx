import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, Button, ActivityIndicator} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {fetchSeats, reserve, confirm, SeatDto} from '../api/client';
import {useAppDispatch, useAppSelector} from '../store';
import {selectSeat, deselectSeat, setReservation, clearReservation} from '../store/slices/bookingSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'SeatSelection'>;

export default function SeatSelectionScreen({route}: Props) {
  const {eventId} = route.params;
  const dispatch = useAppDispatch();
  const booking = useAppSelector(s => s.booking);
  const [seats, setSeats] = useState<SeatDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchSeats(eventId)
      .then(setSeats)
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, [eventId]);

  const seatGrid = useMemo(() => {
    const byRow: Record<string, SeatDto[]> = {};
    seats.forEach(s => {
      byRow[s.rowLabel] = byRow[s.rowLabel] || [];
      byRow[s.rowLabel].push(s);
    });
    Object.values(byRow).forEach(row => row.sort((a, b) => a.seatNumber - b.seatNumber));
    return Object.entries(byRow).sort(([a], [b]) => a.localeCompare(b));
  }, [seats]);

  if (loading) return <ActivityIndicator style={{margin: 16}} />;

  const remaining = booking.expiresAt ? Math.max(0, Math.floor((booking.expiresAt - now) / 1000)) : 0;

  const handleAction = async () => {
    setError(null);
    try {
      if (!booking.reservationId) {
        if (booking.selectedSeatIds.length === 0) {
          setError("Please select at least one seat");
          return;
        }
        const resp = await reserve(eventId, 1, booking.selectedSeatIds);
        dispatch(setReservation({reservationId: resp.reservationId, expiresAt: new Date(resp.expiresAt).getTime()}));
      } else {
        await confirm(booking.reservationId, 1, 'PAY-PLACEHOLDER');
        dispatch(clearReservation());
        alert('Booking Confirmed!');
        // Refresh seats
        const updated = await fetchSeats(eventId);
        setSeats(updated);
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={{padding: 16}}>
      {error && <Text style={{marginBottom: 16, color: 'red', fontWeight: 'bold'}}>{error}</Text>}
      {booking.reservationId && (
        <Text style={{marginBottom: 8}}>
          Hold active: {remaining}s remaining
        </Text>
      )}
      {seatGrid.map(([row, items]) => (
        <View key={row} style={{flexDirection: 'row', marginBottom: 8, alignItems: 'center'}}>
          <Text style={{width: 24, marginRight: 8}}>{row}</Text>
          {items.map(s => {
            const selected = booking.selectedSeatIds.includes(s.id);
            const disabled = s.status !== 'AVAILABLE' && !selected;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => {
                  if (selected) dispatch(deselectSeat(s.id));
                  else if (!disabled) dispatch(selectSeat(s.id));
                }}
                style={{
                  width: 28, height: 28, margin: 2,
                  backgroundColor: selected ? '#1976d2' : disabled ? '#ccc' : '#8bc34a',
                  alignItems: 'center', justifyContent: 'center', borderRadius: 4,
                }}>
                <Text style={{fontSize: 10, color: '#fff'}}>{s.seatNumber}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      <View style={{marginTop: 16}}>
        <Button
          title={booking.reservationId ? 'Confirm Booking' : 'Reserve Selection'}
          onPress={handleAction}
        />
      </View>
    </View>
  );
}

