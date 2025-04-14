// src/audio/LowLatencyQueue.js
class LowLatencyQueue {
  constructor(options = {}) {
    this.bufferSize = options.bufferSize || 4096;
    this.queueSize = options.queueSize || 4;
    this.sampleRate = options.sampleRate || 44100;
    
    this.buffers = [];
    this.activeBuffer = null;
    this.onNeedMoreData = null;
    
    // Initialize buffers
    for (let i = 0; i < this.queueSize; i++) {
      this.buffers.push(new Float32Array(this.bufferSize));
    }
  }
  
  setDataCallback(callback) {
    this.onNeedMoreData = callback;
  }
  
  start() {
    if (!this.onNeedMoreData) {
      throw new Error('Data callback not set');
    }
    
    // Prime the queue
    for (let i = 0; i < this.queueSize; i++) {
      this.fillBuffer(i);
    }
    
    // Start buffer cycling
    this.activeBufferIndex = 0;
    this.isRunning = true;
    this.scheduleNextBuffer();
  }
  
  stop() {
    this.isRunning = false;
  }
  
  fillBuffer(index) {
    if (!this.onNeedMoreData) return;
    
    // Request data from callback
    const buffer = this.buffers[index];
    this.onNeedMoreData(buffer);
  }
  
  scheduleNextBuffer() {
    if (!this.isRunning) return;
    
    // Schedule at precise intervals for timing accuracy
    const bufferDuration = this.bufferSize / this.sampleRate;
    const nextBufferTime = bufferDuration * 1000; // in ms
    
    setTimeout(() => {
      // Switch to next buffer
      this.activeBufferIndex = (this.activeBufferIndex + 1) % this.queueSize;
      this.activeBuffer = this.buffers[this.activeBufferIndex];
      
      // Fill the buffer that was just used
      const bufferToFill = (this.activeBufferIndex + this.queueSize - 1) % this.queueSize;
      this.fillBuffer(bufferToFill);
      
      // Schedule next buffer switch
      this.scheduleNextBuffer();
    }, nextBufferTime / 2); // Schedule ahead of time to ensure smooth transitions
  }
  
  getCurrentBuffer() {
    return this.activeBuffer;
  }
}

export default LowLatencyQueue;
