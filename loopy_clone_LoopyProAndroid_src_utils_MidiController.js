// src/utils/MidiController.js - with real implementation
import { MidiWrapper } from 'react-native-midi';
import { Platform } from 'react-native';

class MidiController {
  constructor() {
    this.isConnected = false;
    this.devices = [];
    this.mappings = {};
    this.learningCallback = null;
    this.midiListeners = {};

    // Initialize MIDI if available
    this.init();
  }

  async init() {
    // Check if MIDI is supported
    if (!MidiWrapper) {
      console.warn('MIDI support not available');
      return;
    }

    try {
      // Initialize MIDI
      await MidiWrapper.initialize();

      // Set up MIDI message listener
      MidiWrapper.addMessageListener(this.handleMidiMessage);

      console.log('MIDI system initialized');

      // Scan for devices
      this.scanForDevices();
    } catch (error) {
      console.error(`Error initializing MIDI: ${error}`);
    }
  }

  async scanForDevices() {
    if (!MidiWrapper) return [];

    try {
      // Get list of MIDI devices
      const devices = await MidiWrapper.getDevices();
      this.devices = devices.map(device => ({
        id: device.id,
        name: device.name,
        type: device.type || (Platform.OS === 'ios' ? 'Bluetooth' : 'USB'),
        connected: device.connected || false
      }));

      console.log(`Found ${this.devices.length} MIDI devices`);
      return this.devices;
    } catch (error) {
      console.error(`Error scanning for MIDI devices: ${error}`);
      return [];
    }
  }

  async connectDevice(deviceId) {
    if (!MidiWrapper) return false;

    try {
      // Connect to the device
      await MidiWrapper.connectDevice(deviceId);

      // Update device status
      this.devices = this.devices.map(device => ({
        ...device,
        connected: device.id === deviceId ? true : device.connected
      }));

      this.isConnected = true;
      console.log(`Connected to MIDI device ${deviceId}`);
      return true;
    } catch (error) {
      console.error(`Error connecting to MIDI device: ${error}`);
      return false;
    }
  }

  async disconnectDevice(deviceId) {
    if (!MidiWrapper) return false;

    try {
      // Disconnect from the device
      await MidiWrapper.disconnectDevice(deviceId);

      // Update device status
      this.devices = this.devices.map(device => ({
        ...device,
        connected: device.id === deviceId ? false : device.connected
      }));

      this.isConnected = this.devices.some(device => device.connected);
      console.log(`Disconnected from MIDI device ${deviceId}`);
      return true;
    } catch (error) {
      console.error(`Error disconnecting from MIDI device: ${error}`);
      return false;
    }
  }

  // Handle incoming MIDI messages
  handleMidiMessage = (message) => {
    if (!message) return;

    // Extract MIDI data
    const [status, data1, data2] = message.data;

    // Determine message type
    const messageType = status & 0xF0;
    const channel = status & 0x0F;

    // Handle different message types
    switch (messageType) {
      case 0x90: // Note On
        if (data2 > 0) {
          console.log(`Note On: channel=${channel}, note=${data1}, velocity=${data2}`);
          this.handleNoteOn(channel, data1, data2);
        } else {
          // Note On with velocity 0 is treated as Note Off
          console.log(`Note Off: channel=${channel}, note=${data1}`);
          this.handleNoteOff(channel, data1);
        }
        break;

      case 0x80: // Note Off
        console.log(`Note Off: channel=${channel}, note=${data1}`);
        this.handleNoteOff(channel, data1);
        break;

      case 0xB0: // Control Change
        console.log(`Control Change: channel=${channel}, control=${data1}, value=${data2}`);
        this.handleControlChange(channel, data1, data2);
        break;

      default:
        // Other MIDI messages (not used in this app)
        break;
    }

    // If in learning mode, send the message to the learning callback
    if (this.learningCallback) {
      this.learningCallback(data1, channel);
      this.learningCallback = null;
    }
  }

  // Handle Note On messages
  handleNoteOn(channel, note, velocity) {
    // Check mappings for this note/channel
    for (const [controlId, mapping] of Object.entries(this.mappings)) {
      if (mapping.note === note && mapping.channel === channel) {
        // Trigger the mapped control
        this.triggerMappedControl(controlId, velocity / 127);
      }
    }
  }

  // Handle Note Off messages
  handleNoteOff(channel, note) {
    // Similar to Note On, but for note release events
  }

  // Handle Control Change messages
  handleControlChange(channel, controller, value) {
    // Check mappings for this controller/channel
    for (const [controlId, mapping] of Object.entries(this.mappings)) {
      if (mapping.note === controller && mapping.channel === channel) {
        // Trigger the mapped control with normalized value
        this.triggerMappedControl(controlId, value / 127);
      }
    }
  }

  // Trigger actions based on MIDI mappings
  triggerMappedControl(controlId, value) {
    // Check if we have a listener for this control
    if (this.midiListeners[controlId]) {
      this.midiListeners[controlId](value);
    }
  }

  // Start MIDI learning for a control
  startLearning(controlId, callback) {
    console.log(`Starting MIDI learning for control ${controlId}`);
    this.learningCallback = callback;
  }

  // Register a listener for a mapped control
  registerListener(controlId, callback) {
    this.midiListeners[controlId] = callback;
  }

  // Unregister a listener
  unregisterListener(controlId) {
    delete this.midiListeners[controlId];
  }

  // Get MIDI mappings
  getMappings() {
    return this.mappings;
  }

  // Set MIDI mappings
  setMappings(mappings) {
    this.mappings = mappings;
    console.log(`Set ${Object.keys(mappings).length} MIDI mappings`);
  }

  // Send a MIDI note message
  sendNote(channel, note, velocity) {
    if (!MidiWrapper || !this.isConnected) return;

    try {
      // Create Note On message
      const noteOnStatus = 0x90 | (channel & 0x0F);
      const message = [noteOnStatus, note & 0x7F, velocity & 0x7F];

      // Send the message
      MidiWrapper.sendMessage(message);
      console.log(`Sent MIDI note ${note} with velocity ${velocity} on channel ${channel}`);
    } catch (error) {
      console.error(`Error sending MIDI message: ${error}`);
    }
  }

  // Clean up resources
  cleanup() {
    if (MidiWrapper) {
      MidiWrapper.removeMessageListener(this.handleMidiMessage);

      // Disconnect from all connected devices
      this.devices.forEach(device => {
        if (device.connected) {
          this.disconnectDevice(device.id);
        }
      });
    }

    // Clear any listeners
    this.midiListeners = {};
    this.learningCallback = null;
    this.isConnected = false;

    console.log('Cleaned up MIDI controller');
  }
}

export default MidiController;