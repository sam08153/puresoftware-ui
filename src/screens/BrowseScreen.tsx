import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {EventDto, fetchEvents} from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Browse'>;

export default function BrowseScreen({navigation}: Props) {
  const [items, setItems] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchEvents({})
      .then(setItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{margin: 16}} />;
  if (error) return <Text style={{margin: 16}}>Error: {error}</Text>;

  return (
    <FlatList
      data={items}
      keyExtractor={item => String(item.id)}
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('EventDetails', {eventId: item.id})}
          style={{padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee'}}>
          <Text style={{fontSize: 16, fontWeight: '600'}}>{item.title}</Text>
          <Text>{item.category} • {item.city}</Text>
          <Text>{new Date(item.eventDateTime).toLocaleString()}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

