import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import {readFile, readDir, DownloadDirectoryPath} from 'react-native-fs';
import {readString} from 'react-native-csv';
import {RadioButton} from 'react-native-paper';
import {clr} from '../customStyles/elements';




/* 
1. Put list of files to modal (select files if available)
2. 

*/
const SettingsScreen = ({navigation}) => {
  const [fileList, setFileList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState('');
  const [checked, setChecked] = useState('');

  useEffect(() => {
    setFileList([]);
    setIncomeList([]);
    getInitialFiles();
  }, []);

  const getInitialFiles = async () => {
    try {
      let tmp = await readDir(DownloadDirectoryPath);
      const dirFiles = [];
      tmp.forEach(item => {
        if (!item.path.endsWith('.csv')) return;
        dirFiles.push(item.path);
      });
      setFileList(dirFiles);

      if (dirFiles.length > 0) {
        handleData(dirFiles[0]);
      }
    } catch (error) {
      console.log('ERROR is: ', error.message);
    }
  };

  const handleData = async x => {
    setCurrentFile(x.split('/')[x.split('/').length - 1]);
    setChecked(x);
    setIncomeList([]);
    const alin1 = await readFile(x);
    const alin2 = readString(alin1, {header: false});
    const temp = [];
    const t = alin2.data;
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
    handleData(x);
  };
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topBar}>
        <View style={styles.buttonContainer}>
          <Button title="<-" onPress={() => navigation.navigate('Main')} />
        </View>
        <Text style={styles.barText}>Settings page</Text>
      </View>

      <View style={styles.listFiles}>
        {fileList.map(item => {
          return (
            <View
              style={{
                borderRadius: 5,
                marginVertical: 2,
                marginHorizontal: 5,
                backgroundColor: clr.bgPrimary,
              }}>
              <RadioButton.Group
                onValueChange={item => {
                  setChecked(item);
                  handleFileSelect(item);
                }}
                value={checked}>
                <RadioButton.Item
                  position="leading"
                  uncheckedColor={clr.textLight}
                  color={clr.blue}
                  label={item.split('/')[item.split('/').length - 1]}
                  value={item}
                  labelStyle={styles.radioButton}
                />
              </RadioButton.Group>
            </View>
          );
        })}
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
              fontSize: 12,
            }}>
            Selected file: {currentFile} ({incomeList.length} items) {'\n'}(
            Showing only latest entry )
          </Text>
          <View
            style={{
              marginVertical: 2,
              marginHorizontal: 5,
            }}>
            {incomeList.length > 0 && (
              <Text style={{color: 'white', padding: 0, fontSize: 14}}>
                {incomeList.reverse()[0].map(item => {
                  return (
                    <Text>
                      {Object.keys(item)[0]}: {Object.values(item)[0]}
                      {'\n'}
                    </Text>
                  );
                })}
              </Text>
            )}
          </View>
        </View>
      )}
      <Text>1</Text>
      <Text>2</Text>
      <Text>3</Text>
      <Text>4</Text>
      <Text>5</Text>
      <Text>6</Text>
      <Text>6</Text>
      <Text>7</Text>
      <Text>8</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>9</Text>
      <Text>End</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    minHeight: '100%',
    // justifyContent: 'flex-start',
    backgroundColor: clr.bgSecondary,
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
    marginTop: 10,
    backgroundColor: clr.bgPrimary,
    borderRadius: 5,
    margin: 5,
  },
  listFiles: {
    width: '100%',
  },
  radioButton: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
  },
});

export default SettingsScreen;
