import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const PerPeriodItem = ({item}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{item.id} - {item.sm} lei</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#252525',
    marginVertical: 3,
    padding: 5,
    borderRadius: 5
  },
  text: {
    color: 'white',
    textAlign: 'left',
    fontSize: 16,
    paddingStart: 30,
    width: "100%",
},
});

export default PerPeriodItem;
