import React from 'react';
import {View, StyleSheet} from 'react-native';

const CardContainer = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#252525',
  },
});

export default CardContainer;
