import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BrowseScreen from '../screens/BrowseScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';

export type RootStackParamList = {
  Browse: undefined;
  EventDetails: {eventId: number};
  SeatSelection: {eventId: number};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Browse" component={BrowseScreen} options={{title: 'Browse Events'}} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{title: 'Event Details'}} />
        <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} options={{title: 'Select Seats'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

