import React from 'react';
import {Pressable, StyleSheet, TextInput, View, Text} from 'react-native';
import { clr } from '../customStyles/elements';

const CustomInput = props => {

  return (
    <View style={styles.container}>
      <TextInput
        autoCorrect={false}
        placeholderTextColor="#888"
        style={[styles.input, {...props.style}]}
        cursorColor="coral"
        onChangeText={text => props.onChangeText(text)}
        value={props.value ? props.value : ''}
        {...props}
      />
      {props.maxLength && props.value && (
        <Text
          style={[
            styles.noOfChars,
            {
              color:
                props.maxLength === props.value.length ? clr.tabsActiveColor : clr.textLight,
            },
          ]}>
          Characters remaining:&nbsp;
          {!props.value
            ? +props.maxLength
            : +props.maxLength - props.value.length}
        </Text>
      )}

      {props.removeButton
        ? ''
        : props.value && (
            <Pressable
              style={styles.clearContainer}
              onPress={
                props.eraseValue
                  ? props.eraseValue
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
    height: 30,
    padding: 0,
    paddingRight: 0,
    paddingLeft: 20,
    fontSize: 14,
    borderRadius: 5,
    backgroundColor: '#ccc',
    color: clr.bgTertiary,
    textAlign: "center"
  },
  clearContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 30,
    width: 30,
  },
  clearText: {
    color: clr.bgTertiary,
    backgroundColor: clr.gray2,
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  noOfChars: {
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: 10,
  },
});

export default CustomInput;
