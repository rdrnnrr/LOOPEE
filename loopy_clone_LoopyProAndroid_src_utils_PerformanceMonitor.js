// src/utils/PerformanceMonitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      frameDrops: 0,
      audioGlitches: 0,
      averageLoopRenderTime: 0,
      effectProcessingTime: {},
      memoryUsage: []
    };
    
    this.loopRenderTimes = [];
    this.enabled = __DEV__;
    this.startTime = Date.now();
    
    // Set up intervals for tracking
    if (this.enabled) {
      this.memoryInterval = setInterval(this.trackMemoryUsage, 60000); // Every minute
    }
  }
  
  trackFrameDrop() {
    this.metrics.frameDrops++;
  }
  
  trackAudioGlitch() {
    this.metrics.audioGlitches++;
  }
  
  trackLoopRenderTime(trackId, timeMs) {
    this.loopRenderTimes.push(timeMs);
    
    // Keep only the last 100 measurements
    if (this.loopRenderTimes.length > 100) {
      this.loopRenderTimes.shift();
    }
    
    // Calculate average
    this.metrics.averageLoopRenderTime = 
      this.loopRenderTimes.reduce((sum, time) => sum + time, 0) / this.loopRenderTimes.length;
  }
  
  trackEffectProcessingTime(effectId, timeMs) {
    if (!this.metrics.effectProcessingTime[effectId]) {
      this.metrics.effectProcessingTime[effectId] = [];
    }
    
    this.metrics.effectProcessingTime[effectId].push(timeMs);
    
    // Keep only the last 50 measurements
    if (this.metrics.effectProcessingTime[effectId].length > 50) {
      this.metrics.effectProcessingTime[effectId].shift();
    }
  }
  
  trackMemoryUsage = () => {
    // In a real app, you would get actual memory usage
    // For this example, we'll simulate it
    const memoryUsage = Math.round(50 + Math.random() * 100); // 50-150 MB
    
    this.metrics.memoryUsage.push({
      timestamp: Date.now(),
      value: memoryUsage
    });
    
    // Keep only the last 60 measurements (1 hour)
    if (this.metrics.memoryUsage.length > 60) {
      this.metrics.memoryUsage.shift();
    }
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      uptime: (Date.now() - this.startTime) / 1000 // in seconds
    };
  }
  
  reset() {
    this.metrics = {
      frameDrops: 0,
      audioGlitches: 0,
      averageLoopRenderTime: 0,
      effectProcessingTime: {},
      memoryUsage: []
    };
    this.loopRenderTimes = [];
    this.startTime = Date.now();
  }
  
  cleanup() {
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }
  }
}

const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;
