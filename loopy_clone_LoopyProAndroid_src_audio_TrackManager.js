// src/audio/TrackManager.js - with real implementation
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

class TrackManager {
  constructor() {
    this.tracks = {};
    this.recorderPlayers = {};
    this.masterPlaying = false;
    this.bpm = 120;
    this.recordingPath = `${RNFS.DocumentDirectoryPath}/recordings/`;

    // Create recordings directory if it doesn't exist
    this.setupStorage();
  }

  async setupStorage() {
    try {
      // Create recordings directory
      const dirExists = await RNFS.exists(this.recordingPath);
      if (!dirExists) {
        await RNFS.mkdir(this.recordingPath);
        console.log('Created recordings directory');
      }
    } catch (error) {
      console.error('Error setting up storage:', error);
    }
  }

  async requestPermissions() {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        return (
          grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (error) {
        console.error('Error requesting permissions:', error);
        return false;
      }
    } else {
      // iOS permissions handled by the library
      return true;
    }
  }

  createTrack(id, color) {
    this.tracks[id] = {
      id,
      color,
      active: false,
      recording: false,
      playing: false,
      filePath: null,
      progress: 0,
      duration: 0,
      sequencerPattern: [],
    };

    // Create a dedicated recorder/player for this track
    this.recorderPlayers[id] = new AudioRecorderPlayer();
    this.recorderPlayers[id].setSubscriptionDuration(0.1); // Update every 100ms

    console.log(`Created track ${id}`);
    return this.tracks[id];
  }

  // Calculate measures based on BPM
  calculateMeasureDuration(beatsPerMeasure) {
    // Duration in milliseconds
    return (60 / this.bpm) * beatsPerMeasure * 1000;
  }

  async startRecording(trackId, bpm, quantize, countIn, beatsPerMeasure) {
    if (!this.tracks[trackId]) return;

    // Request permissions first
    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) {
      console.error('Recording permissions not granted');
      return;
    }

    this.tracks[trackId].recording = true;
    this.bpm = bpm;

    // Set up file path for the recording
    const fileName = `track_${trackId}_${Date.now()}.m4a`;
    const filePath = `${this.recordingPath}${fileName}`;
    this.tracks[trackId].filePath = filePath;

    // Determine when to start recording based on quantization
    if (quantize) {
      if (countIn) {
        // Start recording after a count-in (1 measure)
        console.log(`Count-in for ${beatsPerMeasure} beats...`);

        // Wait for one measure before starting
        const measureDuration = this.calculateMeasureDuration(beatsPerMeasure);
        setTimeout(async () => {
          try {
            await this.recorderPlayers[trackId].startRecorder(filePath);
            console.log(`Started recording on track ${trackId} after count-in`);

            // Set up subscription to track recording progress
            this.recorderPlayers[trackId].addRecordBackListener((e) => {
              this.tracks[trackId].progress = e.currentPosition / 1000; // convert to seconds
            });
          } catch (error) {
            console.error(`Recording error: ${error}`);
            this.tracks[trackId].recording = false;
          }
        }, measureDuration);
      } else {
        // Start recording on the next beat
        const beatDuration = (60 / bpm) * 1000;
        setTimeout(async () => {
          try {
            await this.recorderPlayers[trackId].startRecorder(filePath);
            console.log(`Started recording on track ${trackId} on next beat`);

            // Set up subscription to track recording progress
            this.recorderPlayers[trackId].addRecordBackListener((e) => {
              this.tracks[trackId].progress = e.currentPosition / 1000; // convert to seconds
            });
          } catch (error) {
            console.error(`Recording error: ${error}`);
            this.tracks[trackId].recording = false;
          }
        }, beatDuration);
      }
    } else {
      // Start recording immediately
      try {
        await this.recorderPlayers[trackId].startRecorder(filePath);
        console.log(`Started recording on track ${trackId} immediately`);

        // Set up subscription to track recording progress
        this.recorderPlayers[trackId].addRecordBackListener((e) => {
          this.tracks[trackId].progress = e.currentPosition / 1000; // convert to seconds
        });
      } catch (error) {
        console.error(`Recording error: ${error}`);
        this.tracks[trackId].recording = false;
      }
    }
  }

  async stopRecording(trackId) {
    if (!this.tracks[trackId] || !this.tracks[trackId].recording) return;

    try {
      // Stop recording and get the result
      const result = await this.recorderPlayers[trackId].stopRecorder();
      this.recorderPlayers[trackId].removeRecordBackListener();

      console.log(`Stopped recording on track ${trackId}: ${result}`);

      // Get audio file info to determine duration
      const info = await this.recorderPlayers[trackId].mmSSToSec(
        await this.recorderPlayers[trackId].getCurrentTimeString()
      );

      this.tracks[trackId].recording = false;
      this.tracks[trackId].duration = info;

      // Quantize the recording length if needed (trim to measure)
      if (this.tracks[trackId].filePath) {
        // Here we could add real audio processing to trim the file to beat/measure boundaries
        console.log(`Recording saved to ${this.tracks[trackId].filePath}`);
      }

      return result;
    } catch (error) {
      console.error(`Error stopping recording: ${error}`);
      this.tracks[trackId].recording = false;
    }
  }

  async startPlayback(trackId) {
    if (!this.tracks[trackId] || !this.tracks[trackId].filePath) return;

    try {
      // Set up a listener for playback position updates
      this.recorderPlayers[trackId].addPlayBackListener((e) => {
        // Calculate progress as a percentage (0-1)
        if (e.duration > 0) {
          this.tracks[trackId].progress = e.currentPosition / e.duration;
        }

        // Loop the audio when it reaches the end
        if (e.currentPosition >= e.duration - 50) {
          this.recorderPlayers[trackId].stopPlayer().then(() => {
            this.startPlayback(trackId);  // Restart playback
          });
        }
      });

      // Start playback
      await this.recorderPlayers[trackId].startPlayer(this.tracks[trackId].filePath);
      await this.recorderPlayers[trackId].setVolume(1.0);

      this.tracks[trackId].playing = true;
      console.log(`Started playback on track ${trackId}`);
    } catch (error) {
      console.error(`Error starting playback: ${error}`);
    }
  }

  async stopPlayback(trackId) {
    if (!this.tracks[trackId] || !this.tracks[trackId].playing) return;

    try {
      await this.recorderPlayers[trackId].stopPlayer();
      this.recorderPlayers[trackId].removePlayBackListener();

      this.tracks[trackId].playing = false;
      this.tracks[trackId].progress = 0;

      console.log(`Stopped playback on track ${trackId}`);
    } catch (error) {
      console.error(`Error stopping playback: ${error}`);
    }
  }

  async startMasterPlayback() {
    this.masterPlaying = true;

    // Calculate a small delay between track starts to avoid audio pops
    const startDelay = 20; // milliseconds

    // Start playback on all active tracks with a slight delay between each
    const activeTracks = Object.values(this.tracks).filter(track =>
      track.active && track.filePath
    );

    for (let i = 0; i < activeTracks.length; i++) {
      const track = activeTracks[i];

      // Start each track with a small delay to prevent audio glitches
      setTimeout(() => {
        this.startPlayback(track.id);
      }, i * startDelay);
    }

    console.log('Started master playback');
  }

  async stopMasterPlayback() {
    this.masterPlaying = false;

    // Stop playback on all tracks
    for (const trackId in this.tracks) {
      if (this.tracks[trackId].playing) {
        await this.stopPlayback(parseInt(trackId));
      }
    }

    console.log('Stopped master playback');
  }

  getTrackProgress(trackId) {
    if (!this.tracks[trackId]) return 0;
    return this.tracks[trackId].progress;
  }

  setSequencerPattern(trackId, pattern) {
    if (!this.tracks[trackId]) return;

    this.tracks[trackId].sequencerPattern = pattern;
    console.log(`Set sequencer pattern for track ${trackId}`);
  }

  async eraseTrack(trackId) {
    if (!this.tracks[trackId]) return;

    // Stop playback/recording if active
    if (this.tracks[trackId].playing) {
      await this.stopPlayback(trackId);
    }
    if (this.tracks[trackId].recording) {
      await this.stopRecording(trackId);
    }

    // Delete the recording file if it exists
    if (this.tracks[trackId].filePath) {
      try {
        const exists = await RNFS.exists(this.tracks[trackId].filePath);
        if (exists) {
          await RNFS.unlink(this.tracks[trackId].filePath);
          console.log(`Deleted file for track ${trackId}`);
        }
      } catch (error) {
        console.error(`Error deleting file: ${error}`);
      }
    }

    // Reset track properties
    this.tracks[trackId].filePath = null;
   