import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native';
import XLSX from 'xlsx';
import fs from 'react-native-fs';
import {readRemoteFile, readString} from 'react-native-csv';
import FlatItem from '../components/FlatItem';

const SettingsScreen = ({navigation}) => {
  const [fileList, setFileList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);

  const printFs = async () => {
    const tmp = await fs.readDir(fs.DownloadDirectoryPath);
    const alin = [];
    tmp.forEach(item => {
      alin.push(item.path);
      // console.log(item.path);
    });
    setFileList(alin);
  };

  useEffect(() => {
    console.log('Settings useEffect');
    printFs();
  }, []);

  const moc1 = async () => {
    console.log('====================================');
    const alin2 = await fs.readFile(fileList[0]);
    const alin1 = readString(alin2, {header: false, delimiter: ''});
    const temp = [];
    alin1.data.forEach((item, index) => {
      if(index === 0) return
      const obj = {
        details: item[0],
        dt: item[1],
        description: item[2],
        income: +item[3],
        id: item[4],
      };
      temp.push(obj);
    });
    console.log(temp);
    setIncomeList(temp);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topBar}>
        <View style={styles.buttonContainer}>
          <Button title="<-" onPress={() => navigation.navigate('Main')} />
          <Button title="getFS" onPress={printFs} />
          <Button title="moc1" onPress={moc1} />
        </View>
        <Text style={styles.barText}>Settings page</Text>
      </View>
      <View style={styles.main}>
        <FlatList
          data={incomeList}
          renderItem={({item, index}) => (
            <View style={{borderWidth: 1, borderColor: '#ff000088'}}>
              <Text
                style={{
                  color: 'white',
                  width: '100%',
                  textAlign: 'left',
                  paddingLeft: 10,
                }}>
                {item.dt} - {item.income} - {item.id}
              </Text>
              <Text style={{color: 'coral', paddingLeft: 10}}>
                {item.details}
              </Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#050505',
  },
  topBar: {
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  barText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
    height: '100%',
    textAlignVertical: 'center',
  },
  main: {
    width: '100%',
    // borderWidth: 1,
    // borderColor: 'red',
    flex: 1,
  },
});

export default SettingsScreen;
