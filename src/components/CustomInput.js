import React, {useState} from 'react';
import {Pressable, StyleSheet, TextInput, View, Text} from 'react-native';

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  keyboard,
  width,
  flex,
  editable,
  multiline,
  removeButton,
  maxLength,
  eraseValue,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder ? placeholder : '...'}
        placeholderTextColor="#888"
        style={[
          styles.input,
          {
            width: width ? width : 50,
            flex: flex ? flex : 0,
            height: multiline ? 100 : 30,
          },
        ]}
        cursorColor="coral"
        textAlign="center"
        textAlignVertical={multiline ? 'top' : 'center'}
        onChangeText={text => onChangeText(text)}
        value={value ? value : ''}
        keyboardType={keyboard ? keyboard : 'default'}
        editable={editable ? editable : true}
        multiline={multiline ? multiline : false}
        maxLength={maxLength ? maxLength : 254}
      />
      {maxLength && value && (
        <Text style={[styles.noOfChars,{color: maxLength === value.length ? "#e63946" : "white" }]}>
          Characters remaining:
          {!value ? +maxLength : +maxLength - value.length}
        </Text>
      )}

      {removeButton
        ? ""
        : value && (
            <Pressable
              style={styles.clearContainer}
              onPress={
                eraseValue
                  ? eraseValue
                  : () => console.log('Undefined function!')
              }>
              <Text style={styles.clearText}>X</Text>
            </Pressable>
          )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5,
  },
  input: {
    padding: 0,
    paddingRight: 0,
    paddingLeft: 20,
    fontSize: 14,
    borderRadius: 5,
    backgroundColor: '#ccc',
    color: '#006494',
  },
  clearContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 30,
    width: 30,
  },
  clearText: {
    color: '#006494',
    backgroundColor: '#bbb',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  noOfChars: {
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: 10,
  },
});

export default CustomInput;
