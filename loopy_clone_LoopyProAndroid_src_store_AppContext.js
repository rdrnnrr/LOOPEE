import React, { createContext, useState, useEffect, useRef } from 'react';
import TrackManager from '../audio/TrackManager';
import EffectsProcessor from '../audio/effects/EffectsProcessor';
import InstrumentEngine from '../audio/instruments/InstrumentEngine';
import MidiController from '../utils/MidiController';
import GestureManager from '../utils/GestureManager';

// Create context
export const AppContext = createContext();

// Create provider
export const AppContextProvider = ({ children }) => {
  // App state
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [masterPlaying, setMasterPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [quantizeEnabled, setQuantizeEnabled] = useState(true);
  const [countInEnabled, setCountInEnabled] = useState(true);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  
  // Effects state
  const [effectPresets, setEffectPresets] = useState([]);
  
  // Sequencer state
  const [sequencerSteps, setSequencerSteps] = useState(16);
  const [sequencerPatterns, setSequencerPatterns] = useState({});
  
  // Arpeggiator state
  const [arpSettings, setArpSettings] = useState({
    pattern: 'up',
    octaveRange: 1,
    rate: 8,
    gateTime: 0.8,
  });
  
  // MIDI state
  const [midiMappings, setMidiMappings] = useState({});
  const [midiLearningMode, setMidiLearningMode] = useState(false);
  const [currentMidiControl, setCurrentMidiControl] = useState(null);
  
  // Gesture settings
  const [gestureSettings, setGestureSettings] = useState({
    singleTap: 'select',
    doubleTap: 'playStop',
    longPress: 'menu',
    swipeLeft: 'halfLength',
    swipeRight: 'doubleLength'
  });
  
  // Audio engine refs
  const trackManagerRef = useRef(null);
  const effectsProcessorRef = useRef(null);
  const instrumentEngineRef = useRef(null);
  const midiControllerRef = useRef(null);
  const gestureManagerRef = useRef(null);
  
  // Initialize audio engine
  useEffect(() => {
    // Create instances of audio processing classes
    trackManagerRef.current = new TrackManager();
    effectsProcessorRef.current = new EffectsProcessor();
    instrumentEngineRef.current = new InstrumentEngine();
    midiControllerRef.current = new MidiController();
    gestureManagerRef.current = new GestureManager();
    
    // Initialize default tracks
    const initialTracks = [
      { id: 1, color: '#FF5252', active: false, recording: false, playing: false, progress: 0, name: "Loop 1", effects: [], instrument: null },
      { id: 2, color: '#FF9800', active: false, recording: false, playing: false, progress: 0, name: "Loop 2", effects: [], instrument: null },
      { id: 3, color: '#FFEB3B', active: false, recording: false, playing: false, progress: 0, name: "Loop 3", effects: [], instrument: null },
      { id: 4, color: '#4CAF50', active: false, recording: false, playing: false, progress: 0, name: "Loop 4", effects: [], instrument: null },
      { id: 5, color: '#2196F3', active: false, recording: false, playing: false, progress: 0, name: "Loop 5", effects: [], instrument: null },
      { id: 6, color: '#9C27B0', active: false, recording: false, playing: false, progress: 0, name: "Loop 6", effects: [], instrument: null },
    ];
    setTracks(initialTracks);
    
    // Initialize tracks in audio engine
    initialTracks.forEach(track => {
      trackManagerRef.current.createTrack(track.id, track.color);
    });
    
    // Initialize default effect presets
    const defaultPresets = [
      {
        id: 'preset1',
        name: 'Spacey Delay',
        effects: [
          { 
            id: 'reverb', 
            name: 'Reverb', 
            params: { roomSize: 0.7, damping: 0.5, wet: 0.4, dry: 0.6 }, 
            enabled: true 
          },
          { 
            id: 'delay', 
            name: 'Delay', 
            params: { time: 0.4, feedback: 0.35, wet: 0.4 }, 
            enabled: true 
          }
        ]
      },
      {
        id: 'preset2',
        name: 'Lo-Fi Crush',
        effects: [
          { 
            id: 'bitcrusher', 
            name: 'Bitcrusher', 
            params: { bits: 4, sampleRate: 0.4, mix: 0.7 }, 
            enabled: true 
          },
          { 
            id: 'filter', 
            name: 'Filter', 
            params: { frequency: 2000, resonance: 3, type: 'lowpass' }, 
            enabled: true 
          }
        ]
      },
      {
        id: 'preset3',
        name: 'Pitch Madness',
        effects: [
          { 
            id: 'pitchShift', 
            name: 'Pitch Shift', 
            params: { pitch: 3, windowSize: 0.1, mix: 0.8 }, 
            enabled: true 
          },
          { 
            id: 'stutter', 
            name: 'Stutter', 
            params: { rate: 8, depth: 0.6, mix: 0.5, sync: true }, 
            enabled: true 
          }
        ]
      }
    ];
    setEffectPresets(defaultPresets);
    
    // Clean up when component unmounts
    return () => {
      if (trackManagerRef.current) {
        trackManagerRef.current.cleanup();
      }
      if (midiControllerRef.current) {
        midiControllerRef.current.cleanup();
      }
    };
  }, []);
  
  // Select a track
  const handleTrackSelect = (trackId) => {
    setSelectedTrack(trackId === selectedTrack ? null : trackId);
  };
  
  // Toggle recording for selected track
  const toggleRecording = () => {
    if (selectedTrack === null) return;
    
    // Find the selected track
    const trackData = tracks.find(t => t.id === selectedTrack);
    if (!trackData) return;
    
    if (!trackData.recording) {
      // Start recording
      trackManagerRef.current.startRecording(
        selectedTrack, 
        bpm, 
        quantizeEnabled, 
        countInEnabled,
        beatsPerMeasure
      );
    } else {
      // Stop recording
      trackManagerRef.current.stopRecording(selectedTrack);
    }
    
    // Update track state
    setTracks(prevTracks => 
      prevTracks.map(track => {
        if (track.id === selectedTrack) {
          return { 
            ...track, 
            recording: !track.recording,
            playing: false,
            progress: 0
          };
        }
        return track;
      })
    );
  };
  
  // Toggle playback for selected track
  const togglePlayback = () => {
    if (selectedTrack === null) return;
    
    // Find the selected track
    const trackData = tracks.find(t => t.id === selectedTrack);
    if (!trackData) return;
    
    if (!trackData.playing) {
      // Start playback
      trackManagerRef.current.startPlayback(selectedTrack);
    } else {
      // Stop playback
      trackManagerRef.current.stopPlayback(selectedTrack);
    }
    
    // Update track state
    setTracks(prevTracks => 
      prevTracks.map(track => {
        if (track.id === selectedTrack) {
          return { 
            ...track, 
            playing: !track.playing,
            recording: false
          };
        }
        return track;
      })
    );
  };
  
  // Toggle master playback
  const toggleMasterPlayback = () => {
    if (!masterPlaying) {
      // Start master playback
      trackManagerRef.current.startMasterPlayback();
      
      // Update track states
      setTracks(prevTracks => 
        prevTracks.map(track => ({
          ...track,
          playing: track.active,
          recording: false
        }))
      );
    } else {
      // Stop master playback
      trackManagerRef.current.stopMasterPlayback();
      
      // Update track states
      setTracks(prevTracks => 
        prevTracks.map(track => ({
          ...track,
          playing: false,
          progress: 0
        }))
      );
    }
    
    setMasterPlaying(!masterPlaying);
  };
  
  // Add a new track
  const addTrack = () => {
    const newId = tracks.length + 1;
    const colors = ['#E91E63', '#673AB7', '#03A9F4', '#4CAF50', '#FFC107', '#FF5722'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Create track in audio engine
    trackManagerRef.current.createTrack(newId, randomColor);
    
    // Update track state
    setTracks([
      ...tracks,
      { 
        id: newId, 
        color: randomColor, 
        active: false, 
        recording: false, 
        playing: false, 
        progress: 0,
        name: `Loop ${newId}`,
        effects: [],
        instrument: null
      }
    ]);
  };
  
  // Add effect to selected track
  const addEffectToTrack = (effectId) => {
    if (selectedTrack === null) return;
    
    // Update track state
    setTracks(prevTracks => 
      prevTracks.map(track => {
        if (track.id === selectedTrack) {
          // Check if effect already exists
          const existingEffectIndex = track.effects.findIndex(e => e.id === effectId);
          
          if (existingEffectIndex >= 0) {
            // Toggle effect enabled state
            const updatedEffects = [...track.effects];
            updatedEffects[existingEffectIndex] = {
              ...updatedEffects[existingEffectIndex],
              enabled: !updatedEffects[existingEffectIndex].enabled
            };
            
            // Update effect in audio engine
            effectsProcessorRef.current.updateEffect(
              selectedTrack, 
              effectId, 
              updatedEffects[existingEffectIndex]
            );
            
            return { ...track, effects: updatedEffects };
          } else {
            // Get default effect parameters
            const newEffect = effectsProcessorRef.current.createEffect(effectId);
            
            // Add effect in audio engine
            effectsProcessorRef.current.addEffect(selectedTrack, newEffect);
            
            return { 
              ...track, 
              effects: [...track.effects, newEffect]
            };
          }
        }
        return track;
      })
    );
  };
 