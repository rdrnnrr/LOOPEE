import React from 'react';
import { StatusBar, SafeAreaView, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
import { AppContextProvider } from './store/AppContext';

// Ignore specific warnings
LogBox.ignoreLogs(['Require cycle:', 'Remote debugger']);

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppContextProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#121212" />
          <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
            <AppNavigator />
          </SafeAreaView>
        </NavigationContainer>
      </AppContextProvider>
    </GestureHandlerRootView>
  );
};

export default App;
