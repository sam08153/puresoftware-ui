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
          {(() => {
            const parts = [item.category, item.city].filter(p => p && String(p).trim().length > 0);
            return parts.length ? <Text>{parts.join(' • ')}</Text> : null;
          })()}
          {formatDate(item.eventDateTime) ? <Text>{formatDate(item.eventDateTime)}</Text> : null}
        </TouchableOpacity>
      )}
    />
  );
}
