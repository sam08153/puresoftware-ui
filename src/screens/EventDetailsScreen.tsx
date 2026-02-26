import React, {useEffect, useState} from 'react';
import {View, Text, Button, ActivityIndicator} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {fetchSeats, SeatDto} from '../api/client';
import {useAppDispatch} from '../store';
import {setEvent} from '../store/slices/bookingSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetails'>;

export default function EventDetailsScreen({route, navigation}: Props) {
  const {eventId} = route.params;
  const [seats, setSeats] = useState<SeatDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    fetchSeats(eventId)
      .then(setSeats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <ActivityIndicator style={{margin: 16}} />;
  if (error) return <Text style={{margin: 16}}>Error: {error}</Text>;

  const available = seats.filter(s => s.status === 'AVAILABLE').length;

  return (
    <View style={{padding: 16}}>
      <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 8}}>Event #{eventId}</Text>
      <Text style={{marginBottom: 16}}>Available seats: {available}</Text>
      <Button
        title="Select Seats"
        onPress={() => {
          dispatch(setEvent(eventId));
          navigation.navigate('SeatSelection', {eventId});
        }}
      />
    </View>
  );
}

