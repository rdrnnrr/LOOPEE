import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  ActivityIndicator,
  Alert
} from 'react-native';
import { AppContext } from '../store/AppContext';
import { Music, Check, RefreshCcw, Plus, Trash2, Link } from 'lucide-react-native';

const MidiSettingsScreen = () => {
  const { 
    midiMappings,
    midiLearningMode,
    currentMidiControl,
    startMidiLearning
  } = useContext(AppContext);
  
  // Local state
  const [midiEnabled, setMidiEnabled] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  const [scanningDevices, setScanningDevices] = useState(false);
  const [midiDevices, setMidiDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  // Mock MIDI devices
  const mockDevices = [
    { id: 'device1', name: 'MIDI Keyboard', type: 'USB', connected: true },
    { id: 'device2', name: 'AKAI LPD8', type: 'USB', connected: false },
    { id: 'device3', name: 'Bluetooth MIDI Controller', type: 'Bluetooth', connected: false }
  ];
  
  // Mock mappable controls
  const mappableControls = [
    { id: 'record', name: 'Record Button', category: 'Transport' },
    { id: 'play', name: 'Play Button', category: 'Transport' },
    { id: 'stop', name: 'Stop Button', category: 'Transport' },
    { id: 'master', name: 'Master Play/Pause', category: 'Transport' },
    { id: 'track1', name: 'Select Track 1', category: 'Tracks' },
    { id: 'track2', name: 'Select Track 2', category: 'Tracks' },
    { id: 'track3', name: 'Select Track 3', category: 'Tracks' },
    { id: 'track4', name: 'Select Track 4', category: 'Tracks' },
    { id: 'bpm', name: 'BPM Control', category: 'Timing' },
    { id: 'metronome', name: 'Metronome Toggle', category: 'Timing' },
    { id: 'effectParam1', name: 'Effect 1 Parameter', category: 'Effects' },
    { id: 'effectParam2', name: 'Effect 2 Parameter', category: 'Effects' }
  ];
  
  // Scan for MIDI devices
  const scanForDevices = () => {
    setScanningDevices(true);
    
    // Simulate device scanning
    setTimeout(() => {
      setMidiDevices(mockDevices);
      setScanningDevices(false);
    }, 2000);
  };
  
  // Connect to a MIDI device
  const connectDevice = (deviceId) => {
    // Update connected status
    const updatedDevices = midiDevices.map(device => ({
      ...device,
      connected: device.id === deviceId ? true : device.connected
    }));
    
    setMidiDevices(updatedDevices);
    setSelectedDevice(deviceId);
  };
  
  // Disconnect from a MIDI device
  const disconnectDevice = (deviceId) => {
    // Update connected status
    const updatedDevices = midiDevices.map(device => ({
      ...device,
      connected: device.id === deviceId ? false : device.connected
    }));
    
    setMidiDevices(updatedDevices);
    
    if (selectedDevice === deviceId) {
      setSelectedDevice(null);
    }
  };
  
  // Start MIDI learning
  const handleStartLearning = (controlId, controlName) => {
    startMidiLearning(controlId, controlName);
  };
  
  // Load devices on mount
  useEffect(() => {
    if (midiEnabled && autoConnect) {
      scanForDevices();
    }
  }, []);
  
  // Group controls by category
  const groupedControls = mappableControls.reduce((acc, control) => {
    if (!acc[control.category]) {
      acc[control.category] = [];
    }
    acc[control.category].push(control);
    return acc;
  }, {});
  
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* MIDI Status */}
        <View style={styles.statusSection}>
          <View style={styles.enabledRow}>
            <View style={styles.statusInfo}>
              <Music size={20} color={midiEnabled ? '#4CAF50' : '#666'} style={styles.statusIcon} />
              <Text style={styles.statusTitle}>MIDI Input</Text>
            </View>
            
            <Switch
              value={midiEnabled}
              onValueChange={setMidiEnabled}
              trackColor={{ false: '#555', true: '#4CAF50' }}
              thumbColor={midiEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.statusDescription}>
            <Text style={styles.statusText}>
              {midiEnabled 
                ? 'MIDI controllers can be used to control Loopy Pro'
                : 'MIDI input is disabled'
              }
            </Text>
          </View>
        </View>
        
        {midiEnabled && (
          <>
            {/* Devices Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>MIDI Devices</Text>
                <View style={styles.sectionActions}>
                  <TouchableOpacity 
                    style={styles.scanButton}
                    onPress={scanForDevices}
                    disabled={scanningDevices}
                  >
                    {scanningDevices ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <RefreshCcw size={14} color="#fff" />
                        <Text style={styles.scanButtonText}>Scan</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.autoConnectRow}>
                <Text style={styles.settingsLabel}>Auto-connect to MIDI devices</Text>
                <Switch
                  value={autoConnect}
                  onValueChange={setAutoConnect}
                  trackColor={{ false: '#555', true: '#4CAF50' }}
                  thumbColor={autoConnect ? '#fff' : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.deviceList}>
                {midiDevices.length === 0 ? (
                  <View style={styles.noDevices}>
                    <Text style={styles.noDevicesText}>No MIDI devices found</Text>
                    <TouchableOpacity 
                      style={styles.scanAgainButton}
                      onPress={scanForDevices}
                    >
                      <Text style={styles.scanAgainText}>Scan Again</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  midiDevices.map(device => (
                    <View key={device.id} style={styles.deviceItem}>
                      <View style={styles.deviceInfo}>
                        <Music size={16} color="#4CAF50" style={styles.deviceIcon} />
                        <View>
                          <Text style={styles.deviceName}>{device.name}</Text>
                          <Text style={styles.deviceType}>{device.type} Device</Text>
                        </View>
                      </View>
                      
                      {device.connected ? (
                        <TouchableOpacity 
                          style={styles.disconnectButton}
                          onPress={() => disconnectDevice(device.id)}
                        >
                          <Text style={styles.disconnectText}>Disconnect</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity 
                          style={styles.connectButton}
                          onPress={() => connectDevice(device.id)}
                        >
                          <Text style={styles.connectText}>Connect</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                )}
              </View>
            </View>
            
            {/* MIDI Mappings */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>MIDI Mappings</Text>
                <TouchableOpacity style={styles.clearMappingsButton}>
                  <Trash2 size={14} color="#F44336" />
                  <Text style={styles.clearMappingsText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              
              {selectedDevice ? (
                <View style={styles.mappingsContainer}>
                  {/* MIDI Learning Status */}
                  {midiLearningMode && (
                    <View style={styles.learningStatus}>
                      <ActivityIndicator size="small" color="#4CAF50" />
                      <Text style={styles.learningText}>
                        Waiting for MIDI input for "{currentMidiControl?.name}"...
                      </Text>
                      <TouchableOpacity 
                        style={styles.cancelLearningButton}
                        onPress={() => {
                          // This would call a function to cancel learning
                          console.log('Canceling MIDI learning');
                        }}
                      >
                        <Text style={styles.cancelLearningText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  {/* Control Groups */}
                  {Object.entries(groupedControls).map(([category, controls]) => (
                    <View key={category} style={styles.controlGroup}>
                      <Text style={styles.categoryTitle}>{category}</Text>
                      
                      {controls.map(control => {
                        const mapping = midiMappings[control.id];
                        
                        return (
                          <View key={control.id} style={styles.controlItem}>
                            <Text style={styles.controlName}>{control.name}</Text>
                            
                            {mapping ? (
                              <View style={styles.mappingIn