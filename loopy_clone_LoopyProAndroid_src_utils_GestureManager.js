/**
 * Gesture Manager for track interactions
 */
class GestureManager {
  constructor() {
    this.tapTimeout = 300; // ms
    this.longPressTimeout = 800; // ms
    this.swipeThreshold = 50; // px
  }
  
  /**
   * Set up gesture listeners for a track element
   * @param {Element} element - DOM element
   * @param {Function} onSingleTap - Single tap callback
   * @param {Function} onDoubleTap - Double tap callback
   * @param {Function} onLongPress - Long press callback
   * @param {Function} onSwipeLeft - Swipe left callback
   * @param {Function} onSwipeRight - Swipe right callback
   */
  setupGestures(element, { onSingleTap, onDoubleTap, onLongPress, onSwipeLeft, onSwipeRight }) {
    if (!element) return;
    
    // Track touch state
    let tapCount = 0;
    let lastTapTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let longPressTimer = null;
    
    // Touch start handler
    const handleTouchStart = (e) => {
      // Store touch start position
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      
      // Start long press timer
      longPressTimer = setTimeout(() => {
        // Cancel other gestures
        tapCount = 0;
        
        // Trigger long press callback
        if (onLongPress) onLongPress();
        
        // Clear timer
        longPressTimer = null;
      }, this.longPressTimeout);
    };
    
    // Touch move handler
    const handleTouchMove = (e) => {
      // Cancel long press if touch moves
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      
      // Check for swipe
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = touchX - touchStartX;
      const diffY = touchY - touchStartY;
      
      // Only detect horizontal swipes if they're more horizontal than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.swipeThreshold) {
        if (diffX > 0) {
          // Swipe right
          if (onSwipeRight) onSwipeRight();
        } else {
          // Swipe left
          if (onSwipeLeft) onSwipeLeft();
        }
        
        // Reset touch position to avoid multiple swipes
        touchStartX = touchX;
        touchStartY = touchY;
      }
    };
    
    // Touch end handler
    const handleTouchEnd = () => {
      // Cancel long press
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      
      // Calculate tap
      const now = Date.now();
      if (now - lastTapTime < this.tapTimeout) {
        tapCount++;
        
        if (tapCount === 1) {
          // Double tap
          if (onDoubleTap) onDoubleTap();
          tapCount = 0;
        }
      } else {
        // First tap
        tapCount = 1;
        
        // Set timeout to detect if this is a single tap
        setTimeout(() => {
          if (tapCount === 1) {
            // Single tap
            if (onSingleTap) onSingleTap();
            tapCount = 0;
          }
        }, this.tapTimeout);
      }
      
      lastTapTime = now;
    };
    
    // Attach event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);
    
    // Return cleanup function
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }
}

export default GestureManager;
