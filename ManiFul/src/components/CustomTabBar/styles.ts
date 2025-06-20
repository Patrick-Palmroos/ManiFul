import { StyleSheet } from 'react-native';
import text from '../../styles/text';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    height: 80,
    backgroundColor: colors.highlight,
  },

  middleView: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  middleButton: {
    borderRadius: 45,
  },

  middleButtonBgWrapper: {
    //backgroundColor: 'red',
    top: '50%',
    height: 45,
    width: 90,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  middleButtonBg: {
    position: 'absolute',
    backgroundColor: colors.background,
    bottom: '0%',
    borderRadius: 100,
    width: 90,
    height: 90,
  },

  tab: {
    flexDirection: 'column',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '15%',
    //backgroundColor: 'red',
  },
  middleTab: {
    flexDirection: 'column',
    top: -40,
    color: 'white',
    alignItems: 'center',
    width: '25%',
    height: '100%',
    justifyContent: 'center',
    //backgroundColor: 'yellow',
    marginBottom: 10,
  },
  label: {
    ...text.regular,
    fontSize: 13,
    color: 'white',
  },
  labelActive: {
    ...text.regular,
    fontSize: 13,
    color: '#A8FFFE',
  },
});

export default styles;
