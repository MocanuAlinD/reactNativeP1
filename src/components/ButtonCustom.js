import React, {useState} from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';



// title, onPress function
const ButtonCustom = props => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <Pressable
      onPress={props.onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      <Text
        style={[
          styles.bottomContainerTextClear,
          {
            paddingVertical: isPressed ? 4.7 : 5,
            paddingHorizontal: isPressed ? 19.7 : 20,
            fontSize: isPressed ? 16.7 : 17,
            marginLeft: isPressed ? 1 : 0,
            elevation: isPressed ? 1 : 3,
            backgroundColor: props.backgroundColor
              ? props.backgroundColor
              : '#457b9d',
            color: props.color ? props.color : 'white',
            borderRadius: props.borderRadius ? props.borderRadius : 5,
            textAlign: props.textAlign ? props.textAlign : 'center',
            textAlignVertical: props.textAlignVertical
              ? props.textAlignVertical
              : 'center',
          },
        ]}>
        {props.title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  bottomContainerTextClear: {
    shadowColor: 'black',
    shadowOpacity: 0.3,
  },
});

export default ButtonCustom;
