import React from 'react';
import {View, StyleSheet} from 'react-native';

const CardContainer = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    // borderWidth: 3,
    // borderColor: 'red',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff22',
    backgroundColor: '#343a40',
    backgroundColor: '#252525',
  },
});

export default CardContainer;
