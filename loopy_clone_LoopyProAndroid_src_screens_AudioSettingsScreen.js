import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch 
} from 'react-native';
import { AlertCircle, Info, Check, RefreshCcw } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

const AudioSettingsScreen = () => {
  // Audio engine state
  const [engineStatus, setEngineStatus] = useState('active');
  
  // Audio quality settings
  const [sampleRate, setSampleRate] = useState(44100);
  const [bitDepth, setBitDepth] = useState(24);
  const [channels, setChannels] = useState('stereo');
  
  // Latency settings
  const [latencyMode, setLatencyMode] = useState('balanced');
  const [bufferSize, setBufferSize] = useState(512);
  const [backgroundAudio, setBackgroundAudio] = useState(true);
  
  // Audio processing settings
  const [autoGain, setAutoGain] = useState(false);
  const [noiseSuppression, setNoiseSuppression] = useState(false);
  const [echoCancellation, setEchoCancellation] = useState(false);
  
  // File format settings
  const [fileFormat, setFileFormat] = useState('wav');
  const [compressionLevel, setCompressionLevel] = useState(0.5);
  const [sampleRateConversion, setSampleRateConversion] = useState('high');
  
  // Input/Output settings
  const [inputDevice, setInputDevice] = useState('default');
  const [outputDevice, setOutputDevice] = useState('default');
  const [inputGain, setInputGain] = useState(0.75);
  const [outputGain, setOutputGain] = useState(0.9);
  
  // Function to format buffer size numbers
  const formatBufferSize = (size) => {
    if (size >= 1024) {
      return `${size / 1024}k`;
    }
    return size.toString();
  };
  
  // Load audio settings
  useEffect(() => {
    // In a real app, this would load saved settings
    console.log('Loading audio settings');
  }, []);
  
  // Apply audio settings
  const applySettings = () => {
    // In a real app, this would apply the settings to the audio engine
    console.log('Applying audio settings');
  };
  
  // Reset to defaults
  const resetToDefaults = () => {
    setSampleRate(44100);
    setBitDepth(24);
    setChannels('stereo');
    setLatencyMode('balanced');
    setBufferSize(512);
    setBackgroundAudio(true);
    setAutoGain(false);
    setNoiseSuppression(false);
    setEchoCancellation(false);
    setFileFormat('wav');
    setCompressionLevel(0.5);
    setSampleRateConversion('high');
    setInputDevice('default');
    setOutputDevice('default');
    setInputGain(0.75);
    setOutputGain(0.9);
  };
  
  // Render a section header
  const renderSectionHeader = (title, icon, info) => {
    const Icon = icon || Info;
    return (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Icon size={16} color="#4CAF50" style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        
        {info && (
          <TouchableOpacity style={styles.infoButton}>
            <Info size={16} color="#888" />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Audio Engine Status */}
        <View style={styles.statusBar}>
          <View style={styles.statusIndicator}>
            <View 
              style={[
                styles.statusDot,
                engineStatus === 'active' 
                  ? styles.statusActive 
                  : engineStatus === 'warning'
                  ? styles.statusWarning
                  : styles.statusError
              ]} 
            />
            <Text style={styles.statusText}>
              Audio Engine: {engineStatus === 'active' ? 'Running' : engineStatus === 'warning' ? 'Warning' : 'Error'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => setEngineStatus('active')}
          >
            <RefreshCcw size={14} color="#fff" />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
        
        {/* Audio Quality Settings */}
        <View style={styles.settingsSection}>
          {renderSectionHeader('Audio Quality', null, true)}
          
          <View style={styles.settingsGroup}>
            {/* Sample Rate */}
            <View style={styles.settingsItem}>
              <Text style={styles.settingsLabel}>Sample Rate</Text>
              <View style={styles.optionsRow}>
                {[22050, 44100, 48000, 96000].map(rate => (
                  <TouchableOpacity
                    key={rate}
                    style={[
                      styles.optionButton,
                      sampleRate === rate && styles.selectedOption
                    ]}
                    onPress={() => setSampleRate(rate)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        sampleRate === rate && styles.selectedOptionText
                      ]}
                    >
                      {rate / 1000}kHz
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Bit Depth */}
            <View style={styles.settingsItem}>
              <Text style={styles.settingsLabel}>Bit Depth</Text>
              <View style={styles.optionsRow}>
                {[16, 24, 32].map(depth => (
                  <TouchableOpacity
                    key={depth}
                    style={[
                      styles.optionButton,
                      bitDepth === depth && styles.selectedOption
                    ]}
                    onPress={() => setBitDepth(depth)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        bitDepth === depth && styles.selectedOptionText
                      ]}
                    >
                      {depth}-bit
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Channels */}
            <View style={styles.settingsItem}>
              <Text style={styles.settingsLabel}>Channels</Text>
              <View style={styles.optionsRow}>
                {[
                  { value: 'mono', label: 'Mono' },
                  { value: 'stereo', label: 'Stereo' }
                ].map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      channels === option.value && styles.selectedOption
                    ]}
                    onPress={() => setChannels(option.value)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        channels === option.value && styles.selectedOptionText
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
        
        {/* Latency & Performance Settings */}
        <View style={styles.settingsSection}>
          {renderSectionHeader('Latency & Performance', null, true)}
          
          <View style={styles.settingsGroup}>
            {/* Latency Mode */}
            <View style={styles.settingsItem}>
              <Text style={styles.settingsLabel}>Latency Mode</Text>
              <View style={styles.optionsRow}>
                {[
                  { value: 'low', label: 'Low Latency' },
                  { value: 'balanced', label: 'Balanced' },
                  { value: 'high', label: 'High Quality' }
                ].map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      latencyMode === option.value && styles.selectedOption
                    ]}
                    onPress={() => setLatencyMode(option.value)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        latencyMode === option.value && styles.selectedOptionText
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Buffer Size */}
            <View style={styles.settingsItem}>
              <View style={styles.labelRow}>
                <Text style={styles.settingsLabel}>Buffer Size</Text>
                <Text style={styles.valueLabel}>{formatBufferSize(bufferSize)} samples</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={4}
                step={1}
                value={[128, 256, 512, 1024, 2048].indexOf(bufferSize)}
                onValueChange={(value) => setBufferSize([128, 256, 512, 1024, 2048][value])}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#666"
                thumbTintColor="#4CAF50"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Low Latency</Text>
                <Text style={styles.sliderLabel}>High Quality</Text>
              </View>
            </View>
            
            {/* Background Audio */}
            <View style={styles.switchItem}>
              <Text style={styles.settingsLabel}>Background Audio Processing</Text>
              <Switch
                value={backgroundAudio}
                onValueChange={se