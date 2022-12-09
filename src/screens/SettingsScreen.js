import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';
import {readFile, readDir, DownloadDirectoryPath} from 'react-native-fs';
import {readString} from 'react-native-csv';
import {RadioButton} from 'react-native-paper';
import {clr} from '../customStyles/elements';

/* 
1. Put list of files to modal (select files if available)
2. Create totalMoney table in Main.
3. Create income table in Main.
4. Create expenses table in Main.
5. Create recycleBin table in Main (what is erased is added here)
6. Show what is in recycleBin table. (in settings screen)
7. Add to db BTN disabled if no entryes available.

*/
const SettingsScreen = ({navigation}) => {
  const [fileList, setFileList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState('');
  const [checked, setChecked] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [exampleModal, setExampleModal] = useState(false);

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
    setIncomeList(temp.reverse());
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

      <View style={{margin: 5}}>
        <Text>INCOME</Text>
        <Text>Check if everything is correct before adding to DB.</Text>
        <Text>Format INCOME: id,date,details,description,income</Text>
        <Text>Format EXPENSES: id,date,amount,product,category</Text>
        <Text>The old DB will be erased when adding new data.</Text>
        <Text>
          Be sure to export your old db before replacing any new data.
        </Text>
      </View>
      <Button
        disabled={fileList.length === 0 ? true : false}
        title={
          fileList.length
            ? 'Choose a file (found ' + fileList.length + ')'
            : 'No files available'
        }
        onPress={() => setModalVisible(true)}
      />

      {loading && (
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            paddingVertical: 10,
            textAlign: 'center',
            textAlignVertical: 'center',
            width: '100%',
          }}>
          Loading.....
        </Text>
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
            Showing latest entry )
          </Text>
          <View
            style={{
              marginVertical: 2,
              marginHorizontal: 5,
            }}>
            {incomeList.length > 0 && (
              <Text
                style={{
                  color: 'white',
                  marginVertical: 2,
                  backgroundColor: 'black',
                  padding: 10,
                  borderRadius: 5,
                }}>
                {JSON.stringify(incomeList[0])}
              </Text>
            )}
          </View>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'red',
          justifyContent: 'space-between',
        }}>
        <Button title="View example" onPress={() => setExampleModal(true)} />
        <Button title="Add to db" onPress={() => console.log('object')} />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <ScrollView style={styles.listFiles}>
          {fileList.map((item, index) => {
            return (
              <View
                key={index}
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
        </ScrollView>
        <Button title="Close" onPress={() => setModalVisible(false)} />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    backgroundColor: clr.bgSecondary,
    borderWidth: 2,
    borderColor: 'coral',
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
    // height: '50%',
    backgroundColor: clr.bgSecondary,
    borderWidth: 1,
  },
  radioButton: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
  },
});

export default SettingsScreen;
