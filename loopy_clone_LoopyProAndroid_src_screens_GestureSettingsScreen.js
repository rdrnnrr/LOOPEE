import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { AppContext } from '../store/AppContext';
import { 
  Gesture, 
  Check, 
  RefreshCcw, 
  Trash2, 
  Save, 
  Play, 
  Square, 
  Mic, 
  Menu, 
  ArrowRight, 
  Music 
} from 'lucide-react-native';

const GestureSettingsScreen = () => {
  const { gestureSettings, setGestureSettings } = useContext(AppContext);
  
  // Local state for the gesture settings (to apply changes all at once)
  const [localSettings, setLocalSettings] = useState({...gestureSettings});
  
  // Available gesture actions
  const availableActions = [
    { id: 'select', name: 'Select Track', icon: ArrowRight, color: '#2196F3' },
    { id: 'playStop', name: 'Play/Stop', icon: Play, color: '#4CAF50' },
    { id: 'record', name: 'Record', icon: Mic, color: '#F44336' },
    { id: 'menu', name: 'Show Menu', icon: Menu, color: '#9C27B0' },
    { id: 'erase', name: 'Erase Track', icon: Trash2, color: '#F44336' },
    { id: 'halfLength', name: 'Half Length', icon: ArrowRight, color: '#FF9800' },
    { id: 'doubleLength', name: 'Double Length', icon: ArrowRight, color: '#FF9800' },
    { id: 'instrument', name: 'Show Instrument', icon: Music, color: '#4CAF50' }
  ];
  
  // Gesture descriptions
  const gestureDescriptions = {
    singleTap: 'Tap once on a track',
    doubleTap: 'Tap twice quickly on a track',
    longPress: 'Press and hold a track',
    swipeLeft: 'Swipe left on a track',
    swipeRight: 'Swipe right on a track'
  };
  
  // Update a gesture action
  const updateGestureAction = (gesture, actionId) => {
    setLocalSettings({
      ...localSettings,
      [gesture]: actionId
    });
  };
  
  // Apply changes
  const applyChanges = () => {
    setGestureSettings(localSettings);
    Alert.alert('Success', 'Gesture settings saved successfully!');
  };
  
  // Reset to defaults
  const resetToDefaults = () => {
    const defaultSettings = {
      singleTap: 'select',
      doubleTap: 'playStop',
      longPress: 'menu',
      swipeLeft: 'halfLength',
      swipeRight: 'doubleLength'
    };
    
    setLocalSettings(defaultSettings);
  };
  
  // Render an action button
  const renderActionButton = (action, gesture) => {
    const Icon = action.icon || Gesture;
    const isSelected = localSettings[gesture] === action.id;
    
    return (
      <TouchableOpacity
        key={action.id}
        style={[
          styles.actionButton,
          isSelected && { backgroundColor: action.color + '22', borderColor: action.color }
        ]}
        onPress={() => updateGestureAction(gesture, action.id)}
      >
        <Icon 
          size={16} 
          color={isSelected ? action.color : '#aaa'} 
          style={styles.actionIcon} 
        />
        <Text 
          style={[
            styles.actionText,
            isSelected && { color: action.color }
          ]}
        >
          {action.name}
        </Text>
        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: action.color }]} />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Customize Gesture Controls</Text>
          <Text style={styles.headerDescription}>
            Customize how tracks respond to different touch gestures
          </Text>
        </View>
        
        {/* Gesture Settings */}
        {Object.entries(gestureDescriptions).map(([gesture, description]) => (
          <View key={gesture} style={styles.gestureSection}>
            <View style={styles.gestureHeader}>
              <Gesture size={18} color="#4CAF50" style={styles.gestureIcon} />
              <View style={styles.gestureInfo}>
                <Text style={styles.gestureName}>
                  {gesture.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Text>
                <Text style={styles.gestureDescription}>{description}</Text>
              </View>
            </View>
            
            <View style={styles.actionsList}>
              {availableActions.map(action => renderActionButton(action, gesture))}
            </View>
            
            <View style={styles.divider} />
          </View>
        ))}
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetToDefaults}
          >
            <RefreshCcw size={16} color="#ccc" />
            <Text style={styles.resetButtonText}>Reset to Defaults</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={applyChanges}
          >
            <Save size={16} color="#fff" />
            <Text style={styles.applyButtonText}>Save Settings</Text>
          </TouchableOpacity>
        </View>
        
        {/* Example illustration */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Gesture Controls Example</Text>
          
          <View style={styles.exampleTrack}>
            <View style={styles.exampleTrackContent}>
              <Text style={styles.exampleTrackText}>Track 1</Text>
            </View>
            
            <View style={styles.gestureAnnotations}>
              <View style={styles.annotation}>
                <Text style={styles.annotationLine}>───</Text>
                <Text style={styles.annotationText}>Tap to {getActionName('singleTap')}</Text>
              </View>
              
              <View style={styles.annotation}>
                <Text style={styles.annotationLine}>─ ─</Text>
                <Text style={styles.annotationText}>Double-tap to {getActionName('doubleTap')}</Text>
              </View>
              
              <View style={[styles.annotation, styles.annotationRight]}>
                <Text style={styles.annotationText}>{getActionName('swipeRight')} ⟶</Text>
                <Text style={styles.annotationLine}>───</Text>
              </View>
              
              <View style={[styles.annotation, styles.annotationLeft]}>
                <Text style={styles.annotationText}>⟵ {getActionName('swipeLeft')}</Text>
                <Text style={styles.annotationLine}>───</Text>
              </View>
              
              <View style={[styles.annotation, styles.annotationLongPress]}>
                <Text style={styles.annotationLine}>┃</Text>
                <Text style={styles.annotationText}>Long press to {getActionName('longPress')}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.padding} />
      </ScrollView>
    </View>
  );
  
  // Helper function to get action name for the example
  function getActionName(gesture) {
    const action = availableActions.find(a => a.id === localSettings[gesture]);
    return action ? action.name.toLowerCase() : 'do nothing';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerDescription: {
    color: '#aaa',
    fontSize: 14,
  },
  gestureSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  gestureHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  gestureIcon: {
    marginRight: 12,
  },
  gestureInfo: {
    flex: 1,
  },
  gestureName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gestureDescription: {
    color: '#aaa',
    fontSize: 14,
  },
  actionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    color: '#ccc',
    fontSize: 12,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
  },
  resetButtonText: {
    color: '#ccc',
    marginLeft: 8,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  exampleContainer: {
    padding: 16,
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  exampleTitle: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exampleTrack: {
    position: 'relative',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleTrackContent: {
    width: 120,
    height: 120,
    backgroundColor: '#E91E63',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleTrackText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  gestureAnnotations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  annotation: {
    position: 'absolute',
    flexDirection: 