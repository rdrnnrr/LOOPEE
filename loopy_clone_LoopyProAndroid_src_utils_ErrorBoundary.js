// src/utils/ErrorBoundary.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import logger from './Logger';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    logger.error('ErrorBoundary', 'App crashed', { error: error.toString(), info: errorInfo });
    
    // In a real app, you would send this to a crash reporting service
    // Example: crashlytics().recordError(error);
    console.log('App crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', padding: 20 }}>
          <Text style={{ color: '#fff', fontSize: 22, marginBottom: 20, fontWeight: 'bold' }}>
            Oops! Something went wrong
          </Text>
          
          <Text style={{ color: '#ccc', fontSize: 14, marginBottom: 30, textAlign: 'center' }}>
            The app encountered an unexpected error. You can try restarting the app or contact support if the problem persists.
          </Text>
          
          {this.state.error && (
            <View style={{ backgroundColor: '#1E1E1E', padding: 16, borderRadius: 8, marginBottom: 30, width: '100%' }}>
              <Text style={{ color: '#F44336', fontSize: 12 }}>
                {this.state.error.toString()}
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={{ backgroundColor: '#4CAF50', padding: 16, borderRadius: 8, width: '100%', alignItems: 'center' }}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
