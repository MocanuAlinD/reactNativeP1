import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Button,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {tabsBackground} from '../../customStyles/containers';
import SQLite from 'react-native-sqlite-storage';
import {data as old} from '../../lib/data';
import PerPeriodItem from '../../components/perPeriodItem';

/* 
db -> income
details -> cumpana mami
dt ->
id ->
income ->
other -> Ionescu

 {"description": "Laur", "details": "Angelli", "dt": "2016-03-29", "id": "1a5f74c2-d79d-11ec-a1bd-7ec7e3559253", "income": 100} 
*/

const db = SQLite.openDatabase(
  {
    name: 'rn_mocanu.db',
    location: 'default',
  },
  () => {
    () => console.log('Database opened.');
  },
  error => console.log(error),
);

const ByYMDTab = () => {
  const initialValues = {
    years: [],
    months: [],
    days: [],
  };

  const [by, setBy] = useState(initialValues);
  const [changeList, setChangeList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    setBy([]);
    setChangeList([]);
    await db.transaction(tx => {
      tx.executeSql(
        `select * from income`,
        [],
        (a, result) => {
          const len = result.rows.length;
          const totalD = {};
          const totalM = {};
          const totalY = {};
          for (let i = 0; i < len; i++) {
            const item = result.rows.item(i);
            const y = item.dt.split('-', 1)[0].toString();
            const m = item.dt.split('-', 2).join('-');
            const d = item.dt;
            totalD.hasOwnProperty(d)
              ? (totalD[d] += item.income)
              : (totalD[d] = item.income);
            totalM.hasOwnProperty(m)
              ? (totalM[m] += item.income)
              : (totalM[m] = item.income);
            totalY.hasOwnProperty(y)
              ? (totalY[y] += item.income)
              : (totalY[y] = item.income);
          }
          const keysY = Object.keys(totalY);
          const valuesY = Object.values(totalY);
          const keysM = Object.keys(totalM);
          const valuesM = Object.values(totalM);
          const keysD = Object.keys(totalD);
          const valuesD = Object.values(totalD);
          const finalY = [];
          const finalM = [];
          const finalD = [];
          for (let i = 0; i < keysY.length; i++) {
            const finalObj = {
              id: keysY[i].toString(),
              sm: valuesY[i].toString(),
            };
            finalY.push(finalObj);
          }
          for (let i = 0; i < keysM.length; i++) {
            const finalObj = {
              id: keysM[i].toString(),
              sm: valuesM[i].toString(),
            };
            finalM.push(finalObj);
          }
          for (let i = 0; i < keysD.length; i++) {
            const finalObj = {
              id: keysD[i].toString(),
              sm: valuesD[i].toString(),
            };
            finalD.push(finalObj);
          }

          setBy({years: finalY, months: finalM, days: finalD});
          setChangeList(finalY);
          setLoading(false);
        },
        error => console.log(error.message),
      );
    });
  };

  const getMonthName = x => {
    const n = new Date('2022-11-26');
    const tempDate = n.getMonth();
    let mnt;
    switch (tempDate) {
      case 0:
        mnt = 'January';
        break;
      case 1:
        mnt = 'February';
        break;
      case 2:
        mnt = 'March';
        break;
      case 3:
        mnt = 'April';
        break;
      case 4:
        mnt = 'May';
        break;
      case 5:
        mnt = 'June';
        break;
      case 6:
        mnt = 'July';
        break;
      case 7:
        mnt = 'August';
        break;
      case 8:
        mnt = 'September';
        break;
      case 9:
        mnt = 'October';
        break;
      case 10:
        mnt = 'November';
        break;
      case 11:
        mnt = 'December';
        break;
      default:
        mnt = '-';
        break;
    }
    return mnt;
  };

  return (
    <View style={tabsBackground}>
      <View style={styles.wrapper}>
        {loading && <ActivityIndicator size="large" color="#f5cb5c" />}
        <FlatList
          data={changeList}
          renderItem={({item, index}) => (
            <PerPeriodItem key={item.id} item={item} />
          )}
          keyExtractor={item => item.id}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Button title="Year" onPress={() => setChangeList(by.years)} />
        <Button title="Month" onPress={() => setChangeList(by.months)} />
        <Button title="Day" onPress={() => setChangeList(by.days)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
});

export default ByYMDTab;
