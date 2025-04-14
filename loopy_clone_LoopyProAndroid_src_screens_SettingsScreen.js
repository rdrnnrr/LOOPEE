import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { 
  Settings, 
  Volume2, 
  Music, 
  Sliders, 
  HelpCircle, 
  Info, 
  Save, 
  FileText, 
  Trash2 
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();
  
  // Mock settings state
  const [darkTheme, setDarkTheme] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);
  const [backgroundProcessing, setBackgroundProcessing] = React.useState(false);
  
  // Settings sections
  const sections = [
    {
      title: 'General',
      items: [
        { 
          title: 'Dark Theme', 
          type: 'switch',
          value: darkTheme,
          onValueChange: setDarkTheme
        },
        { 
          title: 'Auto-Save', 
          type: 'switch',
          value: autoSave,
          onValueChange: setAutoSave
        },
        { 
          title: 'Background Processing', 
          type: 'switch',
          value: backgroundProcessing,
          onValueChange: setBackgroundProcessing
        }
      ]
    },
    {
      title: 'Audio',
      items: [
        { 
          title: 'Audio Settings', 
          type: 'navigation',
          icon: Volume2,
          onPress: () => navigation.navigate('AudioSettings')
        }
      ]
    },
    {
      title: 'MIDI',
      items: [
        { 
          title: 'MIDI Settings', 
          type: 'navigation',
          icon: Music,
          onPress: () => navigation.navigate('MidiSettings')
        }
      ]
    },
    {
      title: 'Controls',
      items: [
        { 
          title: 'Gesture Settings', 
          type: 'navigation',
          icon: Sliders,
          onPress: () => navigation.navigate('GestureSettings')
        }
      ]
    },
    {
      title: 'Projects',
      items: [
        { 
          title: 'Save Project', 
          type: 'button',
          icon: Save,
          onPress: () => {
            Alert.alert('Save Project', 'Project saved successfully!');
          }
        },
        { 
          title: 'Open Project', 
          type: 'button',
          icon: FileText,
          onPress: () => {
            Alert.alert('Open Project', 'This will open a file picker (not implemented in demo)');
          }
        },
        { 
          title: 'Clear All Tracks', 
          type: 'button',
          icon: Trash2,
          destructive: true,
          onPress: () => {
            Alert.alert(
              'Clear All Tracks',
              'Are you sure you want to clear all tracks? This cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Clear All', 
                  style: 'destructive',
                  onPress: () => {
                    // This would call a function to clear all tracks
                    console.log('Clearing all tracks');
                  }
                }
              ]
            );
          }
        }
      ]
    },
    {
      title: 'About',
      items: [
        { 
          title: 'Help & Documentation', 
          type: 'button',
          icon: HelpCircle,
          onPress: () => {
            Alert.alert('Help', 'This would open the documentation (not implemented in demo)');
          }
        },
        { 
          title: 'About Loopy Pro', 
          type: 'button',
          icon: Info,
          onPress: () => {
            Alert.alert('About', 'Loopy Pro Android\nVersion 1.0.0\n\nA powerful looping app for Android');
          }
        }
      ]
    }
  ];
  
  // Render a settings item
  const renderSettingsItem = (item, index) => {
    switch (item.type) {
      case 'switch':
        return (
          <View key={index} style={styles.settingsRow}>
            <Text style={styles.settingsText}>{item.title}</Text>
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: '#555', true: '#4CAF50' }}
              thumbColor={item.value ? '#fff' : '#f4f3f4'}
            />
          </View>
        );
        
      case 'navigation':
      case 'button':
        const Icon = item.icon || Settings;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.settingsRow,
              item.destructive && styles.destructiveRow
            ]}
            onPress={item.onPress}
          >
            <View style={styles.settingsItemWithIcon}>
              <Icon 
                size={18} 
                color={item.destructive ? '#F44336' : '#4CAF50'} 
                style={styles.itemIcon} 
              />
              <Text 
                style={[
                  styles.settingsText,
                  item.destructive && styles.destructiveText
                ]}
              >
                {item.title}
              </Text>
            </View>
            {item.type === 'navigation' && (
              <Text style={styles.navigationArrow}>›</Text>
            )}
          </TouchableOpacity>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingsItem)}
            </View>
          </View>
        ))}
        
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Loopy Pro Android v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingsText: {
    color: '#fff',
    fontSize: 16,
  },
  settingsItemWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 12,
  },
  navigationArrow: {
    color: '#666',
    fontSize: 20,
    fontWeight: 'bold',
  },
  destructiveRow: {
    borderBottomColor: '#333',
  },
  destructiveText: {
    color: '#F44336',
  },
  versionInfo: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    color: '#666',
    fontSize: 12,
  }
});

export default SettingsScreen;
