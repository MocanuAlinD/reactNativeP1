import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, PermissionsAndroid, Button} from 'react-native';
import {tabsBackground} from '../../customStyles/containers';
import {writeFile, readFile, DownloadDirectoryPath} from 'react-native-fs';
import XLSX from 'xlsx';
import SQLite from 'react-native-sqlite-storage';
import CustomInput from '../../components/CustomInput';
import TextCustom from '../../components/TextCustom';
import DatePicker from 'react-native-date-picker';

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

const ExportAllTab = () => {
  const [state, setState] = useState([]);
  const [exportDate, setExportDate] = useState(Date.now());
  const [exportDate2, setExportDate2] = useState(Date.now());
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await db.transaction(tx => {
      tx.executeSql(`select * from income`, [], (a, res) => {
        const len = res.rows.length;
        const tempList = [];
        for (let i = 0; i < len; i++) {
          // console.log(i, res.rows.item(i))
          tempList.push(res.rows.item(i));
        }
        setState(tempList);
        // console.log(len)
      });
    });
  };

  const printState = async () => {
    console.log('-------------');
    const fixDay1 = new Date(exportDate).getDate() < 10 ? "0" + (new Date(exportDate).getDate() + 1) : new Date(exportDate).getDate()
    const fixMonth1 = new Date(exportDate).getMonth() < 10 ? "0" + (new Date(exportDate).getMonth() + 1) : new Date(exportDate).getMonth()
    const dt1 = `${new Date(exportDate).getFullYear()}-${fixMonth1}-${fixDay1}`
    const dt2 = `${new Date(exportDate2).getFullYear()}-${new Date(exportDate2).getMonth() + 1}-${new Date(exportDate2).getDate()}`
    console.log(dt1)
    console.log(dt2)
    // console.log(state[0])
    // console.log('Export date 1', exportDate);
    // console.log('Export date 2', exportDate2);

    await db.transaction(tx => {
      tx.executeSql(
        `select * from income where dt > ${dt1} and dt < ${dt2}`,
        // `select * from income where dt > "2021-01-01"`,
        [],
        (a, res) => {
          const len = res.rows.length;
          // if(len === 0) {
          //   alert('Nu exista nimic intre aceste date.')
          // }
          for (let i = 0; i < len; i++) {
            console.log(res.rows.item(i).dt);
          }
        },
      );
    });
  };

  const exportAll = async () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, {type: 'binary', bookType: 'csv'});

    // Write file
    await writeFile(
      DownloadDirectoryPath + '/mocanuIncome.csv',
      wbout,
      'ascii',
    ).then(res => alert('Export successfully!'));
  };

  const handleClick = async () => {
    try {
      // Check for Permission (check if permission is already given or not)
      let isPermittedExternalStorage = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (!isPermittedExternalStorage) {
        // Ask for permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage permission needed.',
            buttonNeutral: 'Ask me later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission granted
          console.log('Permission granted');
        } else {
          // Permission denied
          console.log('Permission denied.');
        }
      } else {
        // Already have Permission
        console.log('Permission already granted.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={tabsBackground}>
      <TextCustom>Export all</TextCustom>

      <Button title={`Date from: ${new Date(exportDate).toLocaleDateString()}`} onPress={() => setOpen(true)} />
      <Button title={`Date to: ${new Date(exportDate2).toLocaleDateString()}`} onPress={() => setOpen2(true)} />
      <Button title="Export?" onPress={printState} />
      <DatePicker
        modal
        open={open}
        date={new Date()}
        onConfirm={item => {
          setExportDate(item);
          console.log(item);
          setOpen(false)
        }}
        onCancel={() => {
          setOpen(false);
        }}
        mode="date"
        theme="light"
        title="Pick a date, dude!"
        textColor="#006494"
        maximumDate={new Date()}
        minimumDate={new Date('1980-01-01')}
      />
      <DatePicker
        modal
        open={open2}
        date={new Date()}
        onConfirm={item => {
          setExportDate2(item);
          setOpen2(false);
          console.log(item);
        }}
        onCancel={() => {
          setOpen2(false);
        }}
        mode="date"
        theme="light"
        title="Pick a date, dude!"
        textColor="#006494"
        maximumDate={new Date()}
        minimumDate={new Date('1980-01-01')}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default ExportAllTab;
