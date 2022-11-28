import React from 'react';
import {View, StyleSheet, Text, PermissionsAndroid} from 'react-native';
import {tabsBackground} from '../../customStyles/containers';
import {writeFile, readFile, DownloadDirectoryPath} from 'react-native-fs';
import XLSX from 'xlsx';

const ExportAllTab = () => {
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
      <Text>ExportAllTab</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ExportAllTab;
