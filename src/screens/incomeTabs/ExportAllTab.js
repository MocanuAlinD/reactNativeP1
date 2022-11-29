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
  const [exportDate, setExportDate] = useState(new Date());
  const [exportDate2, setExportDate2] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [filename, setFilename] = useState('');
  const [dateToExport, setDateToExport] = useState('');

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
    // console.log('-------------');
    const fixDay1 =
      new Date(exportDate).getDate() < 10
        ? '0' + new Date(exportDate).getDate()
        : new Date(exportDate).getDate();
    const fixMonth1 =
      new Date(exportDate).getMonth() + 1 < 10
        ? '0' + (new Date(exportDate).getMonth() + 1)
        : new Date(exportDate).getMonth() + 1;
    const fixDay2 =
      new Date(exportDate2).getDate() < 10
        ? '0' + new Date(exportDate2).getDate()
        : new Date(exportDate2).getDate();
    const fixMonth2 =
      new Date(exportDate2).getMonth() + 1 < 10
        ? '0' + (new Date(exportDate2).getMonth() + 1)
        : new Date(exportDate2).getMonth() + 1;
    const dt1 = `${new Date(exportDate).getFullYear()}-${fixMonth1}-${fixDay1}`;
    const dt2 = `${new Date(
      exportDate2,
    ).getFullYear()}-${fixMonth2}-${fixDay2}`;
    if (dt2 < dt1) {
      alert(`"To date:${dt2}" cannot be before starting date.`);
      return;
    }
    const todayDate = `${new Date().getDate()}-${
      new Date().getMonth() + 1
    }-${new Date().getFullYear()}`;
    setDateToExport(todayDate);

    await db.transaction(tx => {
      tx.executeSql(
        `select * from income where dt > '${dt1}' and dt < '${dt2}'`,
        [],
        (a, res) => {
          const len = res.rows.length;
          // console.log(len);
          if (len === 0) {
            alert('Nothing between these dates.');
            return;
          }
          const tempList = [];
          for (let i = 0; i < len; i++) {
            // console.log(res.rows.item(i).dt);
            tempList.push(res.rows.item(i));
          }
          checkPerm(tempList, todayDate);
        },
      );
    });
  };

  const exportAll = async (x, dt) => {
    console.log(filename.trim());
    setFilename(prev => prev.trim());
    if (!filename.trim()) {
      alert('Choose a filename');
      return;
    }
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(x);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, {type: 'binary', bookType: 'csv'});

    const pth = `${DownloadDirectoryPath}/${filename.trim()}${dateToExport}.csv`;

    // Write file
    await writeFile(pth, wbout, 'ascii').then(res =>
      console.log('Export successfully!'),
    );

    alert(`Exported to ${pth}`);
  };

  const checkPerm = async (x, dt) => {
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
          exportAll(x, dt);
          console.log('Permission granted');
        } else {
          // Permission denied
          console.log('Permission denied.');
        }
      } else {
        // Already have Permission
        exportAll(x, dt);
        console.log('Permission already granted.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={tabsBackground}>
      {/* <TextCustom>Export all</TextCustom> */}

      <Button
        title={`Date from: ${new Date(exportDate).toLocaleDateString()}`}
        onPress={() => setOpen(true)}
      />
      <Button
        title={`Date to: ${new Date(exportDate2).toLocaleDateString()}`}
        onPress={() => setOpen2(true)}
      />
      <CustomInput
        placeholder="filename"
        width="100%"
        value={filename}
        onChangeText={text => setFilename(text)}
        eraseValue={() => setFilename('')}
        maxLength={20}
      />
      <TextCustom width="100%" textAlign="center">
        End filename:{'   '}
        {`${filename ? filename : '...'}${dateToExport}.csv`}
      </TextCustom>
      <Button title="Print dates" onPress={printState} />
      {/* <Button title="Export all" onPress={exportAll} /> */}
      <DatePicker
        modal
        open={open}
        date={exportDate}
        onConfirm={item => {
          setExportDate(item);
          setOpen(false);
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
        date={exportDate2}
        onConfirm={item => {
          setExportDate2(item);
          setOpen2(false);
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
