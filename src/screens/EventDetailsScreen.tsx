import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, ActivityIndicator} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {fetchSeats, fetchEvent, EventDto, SeatDto} from '../api/client';
import {useAppDispatch} from '../store';
import {setEvent} from '../store/slices/bookingSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetails'>;

export default function EventDetailsScreen({route, navigation}: Props) {
  const {eventId} = route.params;
  const [event, setEventInfo] = useState<EventDto | null>(null);
  const [seats, setSeats] = useState<SeatDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchEvent(eventId), fetchSeats(eventId)])
      .then(([e, s]) => {
        setEventInfo(e);
        setSeats(s);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <ActivityIndicator style={{margin: 16}} />;
  if (error) return <Text style={{margin: 16}}>Error: {error}</Text>;

  const available = seats.filter(s => s.status === 'AVAILABLE').length;

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

  return (
    <View style={{padding: 16}}>
      <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 8}}>{event ? event.title : `Event #${eventId}`}</Text>
      {event && (() => {
        const parts = [event.category, event.city, formatDate(event.eventDateTime)].filter(p => p && String(p).trim().length > 0);
        return parts.length ? <Text style={{marginBottom: 8}}>{parts.join(' • ')}</Text> : null;
      })()}
      <Text style={{marginBottom: 16}}>Available seats: {available}</Text>
      <Pressable
        onPress={() => {
          dispatch(setEvent(eventId));
          navigation.navigate('SeatSelection', {eventId});
        }}
        style={{
          backgroundColor: '#1976d2',
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 6,
          alignSelf: 'flex-start',
          cursor: 'pointer' as any,
        }}>
        <Text style={{color: '#fff', fontWeight: '700'}}>Select Seats</Text>
      </Pressable>
    </View>
  );
}

