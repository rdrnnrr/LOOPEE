// src/screens/AudioDebugScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppContext } from '../store/AppContext';
import logger from '../utils/Logger';

const AudioDebugScreen = () => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [audioLatency, setAudioLatency] = useState(0);
  const [logs, setLogs] = useState([]);
  
  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, you would get these metrics from native modules
      setCpuUsage(Math.random() * 30); // Mock CPU usage percentage
      setMemoryUsage(Math.round(Math.random() * 200) + 50); // Mock memory usage in MB
      setAudioLatency(Math.round(Math.random() * 20) + 5); // Mock audio latency in ms
      
      // Get logs
      setLogs(logger.getLogs().slice(-20)); // Show last 20 logs
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Test audio buffer
  const testAudioBuffer = () => {
    logger.info('AudioDebug', 'Starting audio buffer test');
    
    // Create and process a test buffer
    // This would actually test real audio processing in a production app
    setTimeout(() => {
      logger.info('AudioDebug', 'Audio buffer test completed');
    }, 500);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Debug</Text>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>CPU Usage</Text>
          <Text style={styles.metricValue}>{cpuUsage.toFixed(1)}%</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Memory</Text>
          <Text style={styles.metricValue}>{memoryUsage} MB</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Audio Latency</Text>
          <Text style={styles.metricValue}>{audioLatency} ms</Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={testAudioBuffer}>
          <Text style={styles.actionButtonText}>Test Audio Buffer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => logger.clearLogs()}>
          <Text style={styles.actionButtonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.logsContainer}>
        <Text style={styles.sectionTitle}>Logs</Text>
        <ScrollView style={styles.logsScroll}>
          {logs.map((log, index) => (
            <View key={index} style={[
              styles.logEntry,
              log.level === 'ERROR' && styles.errorLog,
              log.level === 'WARN' && styles.warnLog
            ]}>
              <Text style={styles.logTime}>{log.timestamp.split('T')[1].split('.')[0]}</Text>
              <View style={styles.logContent}>
                <Text style={styles.logLevel}>{log.level}</Text>
                <Text style={styles.logTag}>{log.tag}</Text>
                <Text style={styles.logMessage}>{log.message}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  metricLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logsContainer: {
    flex: 1,
  },
  logsScroll: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 8,
  },
  logEntry: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  errorLog: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  warnLog: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  logTime: {
    color: '#888',
    fontSize: 10,
    width: 60,
  },
  logContent: {
    flex: 1,
  },
  logLevel: {
    color: '#aaa',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logTag: {
    color: '#2196F3',
    fontSize: 10,
  },
  logMessage: {
    color: '#ccc',
    fontSize: 12,
  },
});

export default AudioDebugScreen;
