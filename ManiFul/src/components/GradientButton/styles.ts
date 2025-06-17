import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    height: 45,
  },
  button: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    width: '95%',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Rubik-Regular',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
});
