import React, {useState} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFont5 from 'react-native-vector-icons/FontAwesome5';

const SortMenu = ({handleSort}) => {
  const initialValues = {
    incomeasc: false,
    incomedesc: false,
    dateasc: true,
    datedesc: false,
  };
  const [state, _setState] = useState(initialValues);

  const setState = key => {
    _setState(prev => ({...initialValues, dateasc: false, [key]: true}));
  };
  return (
    <View style={styles.container}>
      {/* <View style={styles.wrapper}>
        <Text style={styles.text}>Default</Text>
        <Text style={styles.text}>Income</Text>
        <Text style={styles.text}>Income</Text>
        <Text style={styles.text}>Date</Text>
        <Text style={styles.text}>Date</Text>
      </View> */}
      <View style={styles.wrapper}>
        <Pressable
          style={styles.iconContainer}
          onPress={() => {
            setState('dateasc');
            handleSort('dateasc');
          }}>
          <Icon
            style={[styles.icon, {color: state.dateasc ? 'green' : 'white'}]}
            name="sort-calendar-ascending"
          />
        </Pressable>
        <Pressable
          style={styles.iconContainer}
          onPress={() => {
            setState('datedesc');
            handleSort('datedesc');
          }}>
          <Icon
            style={[styles.icon, {color: state.datedesc ? 'green' : 'white'}]}
            name="sort-calendar-descending"
          />
        </Pressable>
        <Pressable
          style={styles.iconContainer}
          onPress={() => {
            setState('incomeasc');
            handleSort('incomeasc');
          }}>
          <IconFont5
            style={[styles.icon, {color: state.incomeasc ? 'green' : 'white'}]}
            name="sort-amount-down-alt"
          />
        </Pressable>
        <Pressable
          style={styles.iconContainer}
          onPress={() => {
            setState('incomedesc');
            handleSort('incomedesc');
          }}>
          <IconFont5
            style={[styles.icon, {color: state.incomedesc ? 'green' : 'white'}]}
            name="sort-amount-up-alt"
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  wrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  iconContainer: {
    flex: 1,
  },
  icon: {
    color: 'white',
    fontSize: 20,
    marginVertical: 5,
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
});

export default SortMenu;
