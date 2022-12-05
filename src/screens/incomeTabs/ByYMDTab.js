import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Button,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {data as old} from '../../lib/data';
import PerPeriodItem from '../../components/perPeriodItem';
import {clr, tabsContainers} from '../../customStyles/elements';
import SortMenuByYMD from '../../components/SortMenuByYMD';

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
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    getData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    wait(50).then(() => setRefreshing(false));
  }, []);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const getData = async () => {
    setLoading(true);
    setBy(initialValues);
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

          setBy({years: finalY.reverse(), months: finalM.reverse(), days: finalD.reverse()});
          setChangeList(finalY);
          setLoading(false);
        },
        error => console.log(error.message),
      );
    });
  };

  const handleSort = x => {
    switch (x) {
      case 'dateasc':
        const sortDateAsc = [...changeList].sort(
          (a, b) => (a.id > b.id && 1) || -1,
        );
        setChangeList(sortDateAsc);
        break;
      case 'datedesc':
        const sortDateDesc = [...changeList].sort(
          (a, b) => (a.id < b.id && 1) || -1,
        );
        setChangeList(sortDateDesc);
        break;
      case 'incomeasc':
        setChangeList(
          [...changeList].sort((a, b) => (+a.sm < +b.sm && 1) || -1),
        );
        break;
      case 'incomedesc':
        setChangeList(
          [...changeList].sort((a, b) => (+a.sm > +b.sm && 1) || -1),
        );
        break;
      default:
        console.log('default');
        break;
    }
  };

  return (
    <View style={tabsContainers}>
      <View style={styles.wrapper}>
        {loading && (
          <ActivityIndicator size="large" color={clr.tabsActiveColor} />
        )}
        <SortMenuByYMD handleSort={handleSort} />
        <FlatList
          data={changeList}
          renderItem={({item, index}) => (
            <PerPeriodItem key={item.id} item={item} />
          )}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
