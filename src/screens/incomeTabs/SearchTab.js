import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  RefreshControl,
  Text,
  FlatList,
  Pressable,
} from 'react-native';
import FlatItem from '../../components/FlatItem';
import EditComponent from '../../components/EditComponent';
import SQLite from 'react-native-sqlite-storage';
import {clr, tabsContainers} from '../../customStyles/elements';

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

const SearchTab = () => {
  const initialValues = {
    income: 0,
    dt: '',
    details: '',
    description: '',
  };

  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [isInFocus, setIsInFocus] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(initialValues);

  useEffect(() => {
    getData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    setSearch('');
    wait(50).then(() => setRefreshing(false));
  }, []);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const getData = async () => {
    setLoading(prev => true);
    setData([]);
    setTempData([]);
    const tempList = [];
    await db.transaction(tx => {
      tx.executeSql('select * from income', [], (tx, results) => {
        let len = results.rows.length;
        for (let i = 0; i < len; i++) {
          const item = results.rows.item(i);
          tempList.push(item);
        }
        setData(tempList.reverse());
        setLoading(false);
        const t1 = tempList.filter(
          item =>
            item.description.toLowerCase().includes(search) ||
            item.details.toLowerCase().includes(search) ||
            item.dt.includes(search) ||
            item.income.toString().includes(search),
        );
        setTempData(t1.reverse());
        setOpenEdit(false);
      });
    });
  };

  const searched = text => {
    setSearch(prev => text);
    const newText = text.toLowerCase().trim();
    const tempList = data.filter(
      item =>
        item.description.toLowerCase().includes(newText) ||
        item.details.toLowerCase().includes(newText) ||
        item.dt.includes(newText) ||
        item.income.toString().includes(newText),
    );
    setTempData(tempList);
  };

  const clearInput = () => {
    setSearch('');
    setTempData([]);
  };

  const handleEditItem = x => {
    const aln = data.filter(itm => itm.id === x)[0];
    setItemToEdit(aln);
    setOpenEdit(true);
  };

  return (
    <View style={tabsContainers}>
      {openEdit && (
        <EditComponent
          setOpenEdit={setOpenEdit}
          getData={getData}
          setItemToEdit={setItemToEdit}
          itemToEdit={itemToEdit}
        />
      )}

      <View style={styles.searchContainer}>
        <View style={styles.buttonsContainer}>
          <TextInput
            placeholder="search..."
            onChangeText={text => searched(text)}
            style={[styles.input]}
            value={search}
            maxLength={23}
            placeholderTextColor={clr.gray2}
            cursorColor={clr.tabsActiveColor}
            onFocus={() => setIsInFocus(true)}
            onBlur={() => setIsInFocus(false)}
            textAlign="center"
          />
          {search && (
            <Pressable style={styles.clearContainer} onPress={clearInput}>
              <Text
                style={{
                  color: clr.bgPrimary,
                  fontSize: 15,
                  height: '100%',
                  width: 40,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}>
                X
              </Text>
            </Pressable>
          )}
        </View>
        {search && (
          <Text style={styles.resultsText}>
            {tempData.length} result{tempData.length > 1 && 's'} found.
          </Text>
        )}
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          data={search ? tempData : []}
          renderItem={({item, index}) => (
            <FlatItem
              item={item}
              idx={index}
              handleEditItem={handleEditItem}
              getData={getData}
            />
          )}
          keyExtractor={(item, index) => index}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 5,
    backgroundColor: clr.textLight,
    color: clr.bgPrimary,
  },
  flatListContainer: {
    width: '100%',
    flex: 1,
    paddingTop: 3,
  },
  resultsText: {
    textAlign: 'center',
    color: clr.textLight,
    marginVertical: 5,
  },
  clearContainer: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: clr.gray2,
  },
});

export default SearchTab;
