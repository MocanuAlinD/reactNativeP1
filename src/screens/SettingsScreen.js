import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Pressable,
} from 'react-native';
import XLSX from 'xlsx';
import fs from 'react-native-fs';
import {readRemoteFile, readString} from 'react-native-csv';
import FlatItem from '../components/FlatItem';

const SettingsScreen = ({navigation}) => {
  const [fileList, setFileList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [fileToRead, setFileToRead] = useState('');

  useEffect(() => {
    console.log('Settings useEffect');
    printFs();
  }, []);

  const printFs = async () => {
    const tmp = await fs.readDir(fs.DownloadDirectoryPath);
    const alin = [];
    tmp.forEach(item => {
      if(!item.path.endsWith(".csv")) return
      alin.push(item.path);
    });
    setFileList(alin);
    if(alin.length > 0){
      moc1(alin[0])
    }
  };

  const moc1 = async (x) => {
    const alin2 = await fs.readFile(x);
    const alin1 = readString(alin2, {header: false, delimiter: ','});
    const temp = [];
    const t = alin1.data
    for(let i = 1; i < 20; i++){
      const obj = {
        details: t[i][0],
        dt: t[i][1],
        description: t[i][2],
        income: +t[i][3],
        id: t[i][4],
      };
      temp.push(obj);
    }
    setIncomeList(temp);
  };

  const handleFileSelect = x => {
    moc1(x)
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topBar}>
        <View style={styles.buttonContainer}>
          <Button title="<-" onPress={() => navigation.navigate('Main')} />
          {/* <Button title="getFS" onPress={printFs} /> */}
          {/* <Button title="moc1" onPress={moc1} /> */}
        </View>
        <Text style={styles.barText}>Settings page</Text>
      </View>
      <View style={styles.main}>
        <FlatList
          data={fileList}
          renderItem={({item, index}) => (
            <View style={{borderWidth: 1, borderColor: '#ff000088', marginVertical: 10}}>
              <Pressable onPress={() => handleFileSelect(item)}>
                <Text style={{color: 'coral', padding: 10}}>
                  {item.split('/')[item.split('/').length - 1]}
                </Text>
              </Pressable>
            </View>
          )}
          keyExtractor={(item, index) => index}
        />
      </View>
      <View style={styles.main}>
        <Text style={{color: "white", width: "100%", textAlign: "center",borderColor: "green", borderWidth: 1}} >Preview first 3:</Text>
        <FlatList
          data={incomeList}
          renderItem={({item}) => (
            <View style={{borderWidth: 1, borderColor: '#ff000088', marginVertical: 10}}>
              <Pressable onPress={() => handleFileSelect(item)}>
                <Text style={{color: 'coral', padding: 10}}>
                  {item.description} - {item.dt}
                </Text>
              </Pressable>
            </View>
          )}
          keyExtractor={(item) => item.id}
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
    borderWidth: 1,
    borderColor: 'red',
    // flex: 1,
  },
});

export default SettingsScreen;
