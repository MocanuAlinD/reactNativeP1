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
import {readFile, readDir, DownloadDirectoryPath} from 'react-native-fs';
import {readString} from 'react-native-csv';

const SettingsScreen = ({navigation}) => {
  const [fileList, setFileList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Settings useEffect');
    setFileList([]);
    setIncomeList([]);
    printFs();
  }, []);

  const printFs = async () => {
    // console.log('===========================================');
    // console.log(DownloadDirectoryPath);
    try {
      let tmp = await readDir(DownloadDirectoryPath);
      // console.log(tmp);
      const alin = [];
      // console.log('Length is:', alin.length);
      tmp.forEach(item => {
        // console.log(item.path)
        if (!item.path.endsWith('.csv')) return;
        alin.push(item.path);
      });
      setFileList(alin);
      if (alin.length > 0) {
        moc1(alin[0]);
      }
    } catch (error) {
      console.log('ERROR is: ', error.message);
    }
  };

  const moc1 = async x => {
    setIncomeList([]);
    const alin2 = await readFile(x);
    const alin1 = readString(alin2, {header: false});
    const temp = [];
    const t = alin1.data;
    const header = t[0];
    for (let i = 1; i < t.length; i++) {
      const tmpObj = [];
      for (let j = 0; j < header.length; j++) {
        if (!t[i][j]) {
          setLoading(false);
          return;
        }
        const obj = {
          [header[j]]: t[i][j],
        };
        tmpObj.push(obj);
      }
      temp.push(tmpObj);
    }
    setIncomeList(temp);
    setLoading(false);
  };

  const handleFileSelect = x => {
    setLoading(true);
    moc1(x);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topBar}>
        <View style={styles.buttonContainer}>
          <Button title="<-" onPress={() => navigation.navigate('Main')} />
        </View>
        <Text style={styles.barText}>Settings page</Text>
      </View>

      <View style={styles.main}>
        <FlatList
          data={fileList}
          renderItem={({item, index}) => (
            <View
              style={{
                borderWidth: 1,
                borderColor: '#ff000088',
                marginVertical: 5,
              }}>
              <Pressable onPress={() => handleFileSelect(item)}>
                <Text style={{color: 'coral', padding: 0}}>
                  {item.split('/')[item.split('/').length - 1]}
                </Text>
              </Pressable>
            </View>
          )}
          keyExtractor={(item, index) => index}
        />
      </View>

      {loading && (
        <View style={{flex: 1}}>
          <Text style={{color: 'white', width: '100%', textAlign: 'center'}}>
          Loading.....
        </Text>
        </View>
      )}

      {!loading && (
        <View style={styles.main}>
          <Text
            style={{
              color: 'white',
              width: '100%',
              textAlign: 'center',
              borderColor: 'green',
              borderWidth: 1,
            }}>
            Preview first {incomeList.length}:
          </Text>
          <FlatList
            data={incomeList}
            renderItem={({item}) => (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ff000088',
                  marginVertical: 0,
                }}>
                <Pressable onPress={() => handleFileSelect(item)}>
                  <Text style={{color: 'coral', padding: 0, fontSize: 10}}>
                    {JSON.stringify(item)}
                  </Text>
                </Pressable>
              </View>
            )}
            keyExtractor={(item, index) => index}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#350505',
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
    fontSize: 20,
    color: 'white',
    height: '100%',
    textAlignVertical: 'center',
  },
  main: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'red',
    flex: 1,
  },
});

export default SettingsScreen;
