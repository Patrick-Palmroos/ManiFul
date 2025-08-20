import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 80,
    alignItems: 'center',
    zIndex: 50,
  },
  tooltipText: {
    fontSize: 12,
    color: '#666',
  },
  tooltipValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default styles;
