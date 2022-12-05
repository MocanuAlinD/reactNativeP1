import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFont5 from 'react-native-vector-icons/FontAwesome5';
import {clr} from '../customStyles/elements';

const SortMenuByYMD = ({handleSort}) => {
  const initialValues = {
    dateasc: false,
    datedesc: false,
    incomeasc: false,
    incomedesc: false,
  };
  const [state, _setState] = useState(initialValues);

  const setState = key => {
    _setState(prev => ({...initialValues, [key]: true}));
  };
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.iconContainer}
        onPress={() => {
          setState('datedesc');
          handleSort('datedesc');
        }}>
        <Icon
          style={[
            styles.icon,
            {color: state.datedesc ? clr.tabsActiveColor : clr.textLight},
          ]}
          name="sort-calendar-descending"
        />
      </Pressable>
      <Pressable
        style={styles.iconContainer}
        onPress={() => {
          setState('dateasc');
          handleSort('dateasc');
        }}>
        <Icon
          style={[
            styles.icon,
            {color: state.dateasc ? clr.tabsActiveColor : clr.textLight},
          ]}
          name="sort-calendar-ascending"
        />
      </Pressable>
      <Pressable
        style={styles.iconContainer}
        onPress={() => {
          setState('incomeasc');
          handleSort('incomeasc');
        }}>
        <IconFont5
          style={[
            styles.icon,
            {color: state.incomeasc ? clr.tabsActiveColor : clr.textLight},
          ]}
          name="sort-numeric-up-alt"
        />
      </Pressable>
      <Pressable
        style={styles.iconContainer}
        onPress={() => {
          setState('incomedesc');
          handleSort('incomedesc');
        }}>
        <IconFont5
          style={[
            styles.icon,
            {color: state.incomedesc ? clr.tabsActiveColor : clr.textLight},
          ]}
          name="sort-numeric-down"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
});

export default SortMenuByYMD;
