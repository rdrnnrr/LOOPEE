// src/utils/Logger.js
class Logger {
  constructor() {
    this.isDebugMode = __DEV__;
    this.logs = [];
    this.maxLogs = 1000;
  }
  
  debug(tag, message, data) {
    if (this.isDebugMode) {
      console.log(`[DEBUG][${tag}] ${message}`, data);
    }
    this.addToLog('DEBUG', tag, message, data);
  }
  
  info(tag, message, data) {
    console.log(`[INFO][${tag}] ${message}`, data);
    this.addToLog('INFO', tag, message, data);
  }
  
  warn(tag, message, data) {
    console.warn(`[WARN][${tag}] ${message}`, data);
    this.addToLog('WARN', tag, message, data);
  }
  
  error(tag, message, error) {
    console.error(`[ERROR][${tag}] ${message}`, error);
    this.addToLog('ERROR', tag, message, error);
  }
  
  addToLog(level, tag, message, data) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      level,
      tag,
      message,
      data: data ? JSON.stringify(data) : undefined
    });
    
    // Keep log size under control
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }
  
  getLogs() {
    return [...this.logs];
  }
  
  exportLogs() {
    return JSON.stringify(this.logs);
  }
  
  clearLogs() {
    this.logs = [];
  }
}

// Create singleton instance
const logger = new Logger();
export default logger;
