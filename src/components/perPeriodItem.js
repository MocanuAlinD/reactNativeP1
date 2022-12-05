import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {clr} from '../customStyles/elements';

const PerPeriodItem = ({item}) => {
  const getMonthName = x => {
    let mnt;
    switch (+x) {
      case 1:
        mnt = 'January';
        break;
      case 2:
        mnt = 'February';
        break;
      case 3:
        mnt = 'March';
        break;
      case 4:
        mnt = 'April';
        break;
      case 5:
        mnt = 'May';
        break;
      case 6:
        mnt = 'June';
        break;
      case 7:
        mnt = 'July';
        break;
      case 8:
        mnt = 'August';
        break;
      case 9:
        mnt = 'September';
        break;
      case 10:
        mnt = 'October';
        break;
      case 11:
        mnt = 'November';
        break;
      case 12:
        mnt = 'December';
        break;
      default:
        mnt = '-';
        break;
    }
    return mnt;
  };

  const a1 = () => {
    let dateToShow;
    const a2 = item.id.split('-');
    const len = a2.length;
    switch (len) {
      case 1:
        dateToShow = a2[0];
        break;
      case 2:
        dateToShow = `${a2[0]}, ${getMonthName(a2[1])}`;
        break;
      case 3:
        dateToShow = `${a2[0]}, ${a2[2]} ${getMonthName(a2[1])}`;
        break;
      default:
        dateToShow = '-';
        break;
    }
    return dateToShow;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={{color: clr.tabsActiveColor}}>{item.sm}</Text> lei - {a1()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: clr.gray3,
    marginVertical: 3,
    padding: 5,
    borderRadius: 5,
  },
  text: {
    color: clr.textLight,
    textAlign: 'left',
    fontSize: 16,
    paddingStart: 30,
    width: '100%',
  },
});

export default PerPeriodItem;
