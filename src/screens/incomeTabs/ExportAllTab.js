import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, PermissionsAndroid} from 'react-native';
import {tabsBackground} from '../../customStyles/containers';
import {writeFile, readFile, DownloadDirectoryPath} from 'react-native-fs';
import XLSX from 'xlsx';
import SQLite from 'react-native-sqlite-storage';
import CustomInput from '../../components/CustomInput';
import TextCustom from '../../components/TextCustom';
// import ButtonCustom from '../../components/ButtonCustom';
import DatePicker from 'react-native-date-picker';
import {Button} from 'react-native-paper';

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
  const [dt1Export, setDt1Export] = useState('');
  const [dt2Export, setDt2Export] = useState('');

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    handleIntervalDates();
  }, [exportDate, exportDate2]);

  const getData = async () => {
    await db.transaction(tx => {
      tx.executeSql(`select * from income`, [], (a, res) => {
        const len = res.rows.length;
        const tempList = [];
        for (let i = 0; i < len; i++) {
          tempList.push(res.rows.item(i));
        }
        setState(tempList);
      });
    });
  };

  const exportInterval = async () => {
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

    await db.transaction(tx => {
      tx.executeSql(
        `select * from income where dt > '${dt1}' and dt < '${dt2}'`,
        [],
        (a, res) => {
          const len = res.rows.length;
          if (len === 0) {
            alert('Nothing between these dates.');
            return;
          }
          const tempList = [];
          for (let i = 0; i < len; i++) {
            tempList.push(res.rows.item(i));
          }
          checkPerm(tempList);
        },
      );
    });
  };

  const exportAll = async x => {
    const todayDate = `${new Date().getDate()}-${
      new Date().getMonth() + 1
    }-${new Date().getFullYear()}`;
    setDateToExport(todayDate);

    await db.transaction(tx => {
      tx.executeSql(`select count(income) from income`, [], (a, res) => {
        if (res.rows.length === 0) {
          alert('No results.');
          return;
        }
        checkPerm(state);
      });
    });
  };

  const checkPerm = async x => {
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
          exportToFile(x);
          console.log('Permission granted');
          alert('Permission granted');
        } else {
          // Permission denied
          console.log('Permission denied.');
          alert('Permission denied.');
        }
      } else {
        // Already have Permission
        exportToFile(x);
        console.log('Permission already granted.');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const exportToFile = async x => {
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
      alert(`Exported to ${pth}`),
    );
  };

  const handleIntervalDates = () => {
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

    const dt1ExportName = `${fixDay1}-${fixMonth1}-${new Date(
      exportDate,
    ).getFullYear()}`;
    const dt2ExportName = `${fixDay2}-${fixMonth2}-${new Date(
      exportDate2,
    ).getFullYear()}`;

    setDt1Export(dt1ExportName);
    setDt2Export(dt2ExportName);

    const dateIntervalFilename = dt1ExportName + '--' + dt2ExportName;
    setDateToExport(dateIntervalFilename);
  };

  return (
    <View style={tabsBackground}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <Button
          uppercase={false}
          color="#0096c7"
          icon="calendar-export"
          mode="contained"
          onPress={() => setOpen(true)}>
          Start: {dt1Export}
        </Button>
        <Button
          uppercase={false}
          color="#0096c7"
          icon="calendar-import"
          mode="contained"
          onPress={() => setOpen2(true)}>
          End: {dt2Export}
        </Button>
      </View>
      <CustomInput
        placeholder="filename"
        width="100%"
        value={filename}
        onChangeText={text => setFilename(text)}
        eraseValue={() => setFilename('')}
        maxLength={20}
      />
      <TextCustom width="100%" textAlign="center">
        {`${filename ? filename : '...  '}${dateToExport}.csv`}
      </TextCustom>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <Button
          uppercase={false}
          color="#0096c7"
          icon="export"
          mode="contained"
          onPress={exportInterval}>
          Export interval
        </Button>
        <Button
          uppercase={false}
          color="#0096c7"
          icon="export"
          mode="contained"
          onPress={exportAll}>
          Export all
        </Button>
      </View>
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
        title={`Choose START date\nmaximum ${dt2Export}`}
        textColor="#006494"
        maximumDate={new Date(exportDate2)}
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
        title={`Choose END date\nminimum ${dt1Export}`}
        textColor="#006494"
        maximumDate={new Date()}
        minimumDate={new Date(exportDate)}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default ExportAllTab;
