import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { AppContext } from '../store/AppContext';
import { Music, Zap, Disc, Play, Stop } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

const InstrumentsScreen = () => {
  const { 
    tracks, 
    selectedTrack,
    instrumentEngine
  } = useContext(AppContext);
  
  // Get selected track data
  const trackData = selectedTrack !== null 
    ? tracks.find(t => t.id === selectedTrack)
    : null;
  
  // Instrument types
  const instrumentTypes = [
    { id: 'basicSynth', name: 'Basic Synth', icon: Music, color: '#2196F3' },
    { id: 'fmSynth', name: 'FM Synth', icon: Zap, color: '#E91E63' },
    { id: 'sampler', name: 'Sampler', icon: Disc, color: '#FF9800' },
    { id: 'drumMachine', name: 'Drum Machine', icon: Music, color: '#9C27B0' }
  ];
  
  // State for keyboard
  const [notePlaying, setNotePlaying] = useState(null);
  
  // Play a note
  const playNote = (note) => {
    if (!trackData || !trackData.instrument) return;
    
    setNotePlaying(note);
    if (instrumentEngine) {
      instrumentEngine.playNote(selectedTrack, note, 1);
    }
  };
  
  // Stop a note
  const stopNote = (note) => {
    if (!trackData || !trackData.instrument) return;
    
    setNotePlaying(null);
    if (instrumentEngine) {
      instrumentEngine.stopNote(selectedTrack, note);
    }
  };
  
  // Select an instrument
  const selectInstrument = (instrumentId) => {
    if (selectedTrack === null) return;
    
    // In a real app, this would call a function to create and assign an instrument
    console.log(`Selecting instrument ${instrumentId} for track ${selectedTrack}`);
  };
  
  // Get instrument controls based on selected instrument
  const getInstrumentControls = () => {
    if (!trackData || !trackData.instrument) return null;
    
    switch (trackData.instrument.id) {
      case 'basicSynth':
        return (
          <View style={styles.instrumentControls}>
            <Text style={styles.controlsTitle}>Basic Synth Parameters</Text>
            
            {/* Oscillator Type */}
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Oscillator Type</Text>
              <View style={styles.buttonRow}>
                {['sine', 'square', 'sawtooth', 'triangle'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.oscButton,
                      trackData.instrument.params.oscillatorType === type && styles.selectedOsc
                    ]}
                    onPress={() => {
                      // This would update the oscillator type
                      console.log(`Setting oscillator to ${type}`);
                    }}
                  >
                    <Text 
                      style={[
                        styles.oscButtonText,
                        trackData.instrument.params.oscillatorType === type && styles.selectedOscText
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Filter Cutoff */}
            <View style={styles.controlRow}>
              <View style={styles.labelRow}>
                <Text style={styles.controlLabel}>Filter Cutoff</Text>
                <Text style={styles.controlValue}>{trackData.instrument.params.filterCutoff} Hz</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={20}
                maximumValue={20000}
                value={trackData.instrument.params.filterCutoff}
                onValueChange={(value) => {
                  // This would update the filter cutoff
                  console.log(`Setting filter cutoff to ${value}`);
                }}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#666"
                thumbTintColor="#4CAF50"
              />
            </View>
            
            {/* ADSR Envelope */}
            <Text style={styles.subTitle}>Envelope</Text>
            
            {/* Attack */}
            <View style={styles.controlRow}>
              <View style={styles.labelRow}>
                <Text style={styles.controlLabel}>Attack</Text>
                <Text style={styles.controlValue}>{trackData.instrument.params.attackTime} s</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0.01}
                maximumValue={2}
                value={trackData.instrument.params.attackTime}
                onValueChange={(value) => {
                  // This would update the attack time
                  console.log(`Setting attack time to ${value}`);
                }}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#666"
                thumbTintColor="#4CAF50"
              />
            </View>
            
            {/* Decay */}
            <View style={styles.controlRow}>
              <View style={styles.labelRow}>
                <Text style={styles.controlLabel}>Decay</Text>
                <Text style={styles.controlValue}>{trackData.instrument.params.decayTime} s</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0.01}
                maximumValue={2}
                value={trackData.instrument.params.decayTime}
                onValueChange={(value) => {
                  // This would update the decay time
                  console.log(`Setting decay time to ${value}`);
                }}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#666"
                thumbTintColor="#4CAF50"
              />
            </View>
            
            {/* Sustain */}
            <View style={styles.controlRow}>
              <View style={styles.labelRow}>
                <Text style={styles.controlLabel}>Sustain</Text>
                <Text style={styles.controlValue}>{Math.round(trackData.instrument.params.sustainLevel * 100)}%</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={trackData.instrument.params.sustainLevel}
                onValueChange={(value) => {
                  // This would update the sustain level
                  console.log(`Setting sustain level to ${value}`);
                }}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#666"
                thumbTintColor="#4CAF50"
              />
            </View>
            
            {/* Release */}
            <View style={styles.controlRow}>
              <View style={styles.labelRow}>
                <Text style={styles.controlLabel}>Release</Text>
                <Text style={styles.controlValue}>{trackData.instrument.params.releaseTime} s</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0.01}
                maximumValue={5}
                value={trackData.instrument.params.releaseTime}
                onValueChange={(value) => {
                  // This would update the release time
                  console.log(`Setting release time to ${value}`);
                }}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#666"
                thumbTintColor="#4CAF50"
              />
            </View>
          </View>
        );
      
      case 'fmSynth':
        return (
          <View style={styles.instrumentControls}>
            <Text style={styles.controlsTitle}>FM Synthesis Parameters</Text>
            
            {/* Carrier/Modulator ratio controls */}
            <View style={styles.controlRow}>
              <View style={styles.labelRow}>
                <Text style={styles.controlLabel}>Carrier Frequency</Text>
                <Text style={styles.controlValue}>{trackData.instrument.params.carrierFreq}x</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0.5}
                maximumValue={4}
                step={0.5}
                value={trackData.instrument.params.carrierFreq}
                onValueChange={(value) => {
                  // This would update the carrier frequency
                  console.log(`Setting carrier frequency to ${value}`);
                }}
                minimumTrackTintColor="#E91E63"
                maximumTrackTintColor="#666"
                thumbTintColor="#E91E63"
              />
            </View>
            
            <View style={styles.controlRow}>
              <View style={styles.labelRow}>
                <Text style={styles.controlLabel}>Modulator Frequency</Text>
                <Text style={styles.controlValue}>{trackData.instrument.params.modulatorFreq}x</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0.5}
                maximumValue={8}
                step={0.5}
                value={trackData.instrument.params.modulatorFreq}
                onValueChange={(value) => {
                  // This would update the modulator frequency
                  console.log(`Setting modulator frequency to ${value}`);
                }}
                minimumTrackTintColor="#E91E63"
                maximumTrackTintColor="#666"
                thumbTintColor="#E91E63"
              />
            </View>
            
            <View style={styles.controlRow}>
              <View style={styles.labelRow}>
                <Text style={styles.c