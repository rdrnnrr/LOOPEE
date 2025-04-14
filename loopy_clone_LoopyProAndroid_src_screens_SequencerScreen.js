import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch 
} from 'react-native';
import { AppContext } from '../store/AppContext';
import { Music, Play, Pause, Square, Settings, Sliders } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

const SequencerScreen = () => {
  const { 
    tracks, 
    selectedTrack, 
    sequencerSteps, 
    setSequencerSteps, 
    sequencerPatterns, 
    toggleSequencerStep, 
    bpm, 
    setBpm,
    arpSettings,
    setArpSettings
  } = useContext(AppContext);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [arpEnabled, setArpEnabled] = useState(false);
  
  // Get selected track pattern
  const trackPattern = selectedTrack !== null 
    ? sequencerPatterns[selectedTrack] || Array(sequencerSteps).fill(false)
    : Array(sequencerSteps).fill(false);
  
  // Step size options
  const stepSizeOptions = [
    { value: 8, label: '8 Steps' },
    { value: 16, label: '16 Steps' },
    { value: 32, label: '32 Steps' }
  ];
  
  // Arp pattern options
  const arpPatternOptions = [
    { value: 'up', label: 'Up' },
    { value: 'down', label: 'Down' },
    { value: 'upDown', label: 'Up-Down' },
    { value: 'random', label: 'Random' }
  ];
  
  // Handle sequencer step toggle
  const handleStepToggle = (stepIndex) => {
    if (selectedTrack === null) return;
    toggleSequencerStep(selectedTrack, stepIndex);
  };
  
  // Toggle sequencer playback
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Start playback animation
      let step = 0;
      const interval = setInterval(() => {
        setCurrentStep(step);
        step = (step + 1) % sequencerSteps;
        if (!isPlaying) {
          clearInterval(interval);
        }
      }, (60 / bpm * 1000) / 4); // 16th notes
    }
  };
  
  // Update arpeggiator settings
  const updateArpSettings = (key, value) => {
    setArpSettings({
      ...arpSettings,
      [key]: value
    });
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {selectedTrack !== null 
              ? `Track ${selectedTrack} Sequencer` 
              : 'Select a track to sequence'}
          </Text>
        </View>
        
        {/* Sequencer Grid */}
        <View style={styles.sequencerSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Step Sequencer</Text>
            <View style={styles.stepSizeSelector}>
              {stepSizeOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.stepSizeButton,
                    sequencerSteps === option.value && styles.selectedStepSize
                  ]}
                  onPress={() => setSequencerSteps(option.value)}
                >
                  <Text 
                    style={[
                      styles.stepSizeText,
                      sequencerSteps === option.value && styles.selectedStepSizeText
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.sequencerGrid}>
              {trackPattern.map((active, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.sequencerStep,
                    active && styles.activeStep,
                    currentStep === index && isPlaying && styles.currentStep,
                    index % 4 === 0 && styles.beatStep,
                  ]}
                  onPress={() => handleStepToggle(index)}
                  disabled={selectedTrack === null}
                >
                  <Text style={styles.stepText}>{index + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          <View style={styles.transportControls}>
            <TouchableOpacity
              style={[
                styles.transportButton,
                styles.playButton,
                selectedTrack === null && styles.disabledButton
              ]}
              onPress={togglePlayback}
              disabled={selectedTrack === null}
            >
              {isPlaying ? (
                <Pause color="#fff" size={20} />
              ) : (
                <Play color="#fff" size={20} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.transportButton,
                styles.stopButton,
                selectedTrack === null && styles.disabledButton
              ]}
              onPress={() => {
                setIsPlaying(false);
                setCurrentStep(0);
              }}
              disabled={selectedTrack === null}
            >
              <Square color="#fff" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Tempo Control */}
        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Tempo</Text>
          <View style={styles.tempoControl}>
            <View style={styles.bpmDisplay}>
              <Text style={styles.bpmText}>{Math.round(bpm)} BPM</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={40}
              maximumValue={240}
              step={1}
              value={bpm}
              onValueChange={setBpm}
              minimumTrackTintColor="#4CAF50"
              maximumTrackTintColor="#666"
              thumbTintColor="#4CAF50"
            />
          </View>
        </View>
        
        {/* Arpeggiator Section */}
        <View style={styles.controlSection}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Arpeggiator</Text>
            <Switch
              value={arpEnabled}
              onValueChange={setArpEnabled}
              trackColor={{ false: '#555', true: '#4CAF50' }}
              thumbColor={arpEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          {arpEnabled && (
            <View style={styles.arpControls}>
              {/* Pattern Selector */}
              <View style={styles.controlGroup}>
                <Text style={styles.controlLabel}>Pattern</Text>
                <View style={styles.patternButtons}>
                  {arpPatternOptions.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.patternButton,
                        arpSettings.pattern === option.value && styles.selectedPattern
                      ]}
                      onPress={() => updateArpSettings('pattern', option.value)}
                    >
                      <Text 
                        style={[
                          styles.patternButtonText,
                          arpSettings.pattern === option.value && styles.selectedPatternText
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Octave Range */}
              <View style={styles.controlGroup}>
                <View style={styles.controlRow}>
                  <Text style={styles.controlLabel}>Octave Range</Text>
                  <Text style={styles.controlValue}>{arpSettings.octaveRange}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={4}
                  step={1}
                  value={arpSettings.octaveRange}
                  onValueChange={(value) => updateArpSettings('octaveRange', value)}
                  minimumTrackTintColor="#4CAF50"
                  maximumTrackTintColor="#666"
                  thumbTintColor="#4CAF50"
                />
              </View>
              
              {/* Rate */}
              <View style={styles.controlGroup}>
                <View style={styles.controlRow}>
                  <Text style={styles.controlLabel}>Rate</Text>
                  <Text style={styles.controlValue}>1/{arpSettings.rate}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={2}
                  maximumValue={32}
                  step={2}
                  value={arpSettings.rate}
                  onValueChange={(value) => updateArpSettings('rate', value)}
                  minimumTrackTintColor="#4CAF50"
                  maximumTrackTintColor="#666"
                  thumbTintColor="#4CAF50"
                />
              </View>
              
              {/* Gate Time */}
              <View style={styles.controlGroup}>
                <View style={styles.controlRow}>
                  <Text style={styles.controlLabel}>Gate Time</Text>
                  <Text style={styles.controlValue}>{Math.round(arpSettings.gateTime * 100)}%</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0.1}
                  maximumValue={1}
                  step={0.05}
                  value={arpSettings.gateTime}
                  onValueChange={(value) => updateArpSettings('gateTime', value)}
                  minimumTrackTintColor="#4CAF50"
                  maximumTrackTintColor="#666"
                  th