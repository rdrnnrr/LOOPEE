import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import EffectsScreen from '../screens/EffectsScreen';
import InstrumentsScreen from '../screens/InstrumentsScreen';
import SequencerScreen from '../screens/SequencerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AudioSettingsScreen from '../screens/AudioSettingsScreen';
import MidiSettingsScreen from '../screens/MidiSettingsScreen';
import GestureSettingsScreen from '../screens/GestureSettingsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E1E1E',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#333333',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: '#121212' }
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Effects" component={EffectsScreen} />
      <Stack.Screen name="Instruments" component={InstrumentsScreen} />
      <Stack.Screen name="Sequencer" component={SequencerScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AudioSettings" component={AudioSettingsScreen} />
      <Stack.Screen name="MidiSettings" component={MidiSettingsScreen} />
      <Stack.Screen name="GestureSettings" component={GestureSettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
