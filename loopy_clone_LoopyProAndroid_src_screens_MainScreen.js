import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';
import { 
  Mic, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Save, 
  Sliders, 
  Music,
  Grid,
  Zap,
  Plus,
  Volume2,
  ChevronDown,
  ChevronUp
} from 'lucide-react-native';
import { AppContext } from '../store/AppContext';
import TrackCard from '../components/loops/TrackCard';
import TrackControlPanel from '../components/controls/TrackControlPanel';
import TimingPanel from '../components/controls/TimingPanel';

const { width } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
  const {
    tracks,
    selectedTrack,
    masterPlaying,
    bpm,
    metronomeEnabled,
    quantizeEnabled,
    countInEnabled,
    beatsPerMeasure,
    setSelectedTrack,
    toggleRecording,
    togglePlayback,
    toggleMasterPlayback,
    addTrack,
    setBpm,
    setMetronomeEnabled,
    setQuantizeEnabled,
    setCountInEnabled,
    setBeatsPerMeasure,
    handleGesture
  } = useContext(AppContext);
  
  // UI state
  const [showTimingPanel, setShowTimingPanel] = useState(false);
  const timingPanelHeight = useRef(new Animated.Value(0)).current;
  const timingPanelOpacity = useRef(new Animated.Value(0)).current;
  
  // Toggle timing panel with animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(timingPanelHeight, {
        toValue: showTimingPanel ? 200 : 0,
        duration: 300,
        useNativeDriver: false
      }),
      Animated.timing(timingPanelOpacity, {
        toValue: showTimingPanel ? 1 : 0,
        duration: 300,
        useNativeDriver: false
      })
    ]).start();
  }, [showTimingPanel]);
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Loopy Pro</Text>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowTimingPanel(!showTimingPanel)}
          >
            <Zap color={showTimingPanel ? '#4CAF50' : '#fff'} size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate
style={styles.headerButton}
            onPress={() => navigation.navigate('Effects')}
          >
            <Sliders color="#fff" size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Instruments')}
          >
            <Music color="#fff" size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Sequencer')}
          >
            <Grid color="#fff" size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Settings color="#fff" size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
          >
            <Save color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Timing Panel */}
      <Animated.View 
        style={[
          styles.timingPanelContainer,
          { 
            height: timingPanelHeight,
            opacity: timingPanelOpacity
          }
        ]}
      >
        {showTimingPanel && (
          <TimingPanel 
            bpm={bpm}
            setBpm={setBpm}
            metronomeEnabled={metronomeEnabled}
            setMetronomeEnabled={setMetronomeEnabled}
            quantizeEnabled={quantizeEnabled}
            setQuantizeEnabled={setQuantizeEnabled}
            countInEnabled={countInEnabled}
            setCountInEnabled={setCountInEnabled}
            beatsPerMeasure={beatsPerMeasure}
            setBeatsPerMeasure={setBeatsPerMeasure}
          />
        )}
      </Animated.View>
      
      {/* Main Loop Grid */}
      <ScrollView 
        style={styles.mainContent}
        contentContainerStyle={styles.gridContainer}
      >
        {tracks.map(track => (
          <TrackCard
            key={track.id}
            track={track}
            isSelected={selectedTrack === track.id}
            onSelect={() => handleGesture('singleTap', track.id)}
            onDoubleTap={() => handleGesture('doubleTap', track.id)}
            onLongPress={() => handleGesture('longPress', track.id)}
            onSwipeLeft={() => handleGesture('swipeLeft', track.id)}
            onSwipeRight={() => handleGesture('swipeRight', track.id)}
          />
        ))}
        
        {/* Add Track Button */}
        <TouchableOpacity 
          style={styles.addTrackButton}
          onPress={addTrack}
        >
          <Plus color="#aaa" size={24} />
          <Text style={styles.addTrackText}>Add Loop</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Transport Controls */}
      <View style={styles.transportControls}>
        <View style={styles.transportContainer}>
          <View style={styles.trackInfo}>
            <Text style={styles.trackInfoText}>
              {selectedTrack !== null 
                ? `Track ${selectedTrack} selected` 
                : 'No track selected'}
            </Text>
          </View>
          
          <View style={styles.transportButtons}>
            <TouchableOpacity
              style={[
                styles.transportButton,
                styles.recordButton,
                selectedTrack === null && styles.disabledButton
              ]}
              onPress={toggleRecording}
              disabled={selectedTrack === null}
            >
              <Mic color="#fff" size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.transportButton,
                styles.playButton,
                selectedTrack === null && styles.disabledButton
              ]}
              onPress={togglePlayback}
              disabled={selectedTrack === null}
            >
              <Play color="#fff" size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.transportButton,
                styles.stopButton,
                selectedTrack === null && styles.disabledButton
              ]}
              onPress={() => {
                if (selectedTrack !== null) {
                  // Stop the selected track
                  const trackData = tracks.find(t => t.id === selectedTrack);
                  if (trackData && trackData.playing) {
                    togglePlayback();
                  }
                }
              }}
              disabled={selectedTrack === null}
            >
              <Square color="#fff" size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.transportButton,
                styles.masterButton,
              ]}
              onPress={toggleMasterPlayback}
            >
              {masterPlaying ? (
                <Pause color="#fff" size={24} />
              ) : (
                <Play color="#fff" size={24} />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.volumeControl}>
            <Volume2 color="#aaa" size={16} />
            <View style={styles.volumeSlider}>
              <View style={styles.volumeSliderFill} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  timingPanelContainer: {
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    overflow: 'hidden',
  },
  mainContent: {
    flex: 1,
  },
  gridContainer: {
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addTrackButton: {
    width: width / 2 - 16,
    aspectRatio: 1,
    margin: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTrackText: {
    color: '#aaa',
    marginTop: 8,
  },
  transportControls: {
    height: 80,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#333',
    padding: 16,
  },
  transportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackInfo: {
    width: 80,
  },
  trackInfoText: {
    color: '#aaa',
    fontSize: 12,
  },
  transportButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transportButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  recordButton: {
    backgroundColor: '#F44336',
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#FF9800',
  },
  masterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
  },
  disabledButton: {
    opacity: 0.5,
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    w