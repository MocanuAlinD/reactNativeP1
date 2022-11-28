import React from 'react';
import {Text} from 'react-native';

const TextCustom = ({
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  children,
  color,
  fontFamily,
  fontSize,
  height,
  margin,
  marginHorizontal,
  marginLeft,
  marginRight,
  marginVertical,
  padding,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingVertical,
  textAlign,
  textAlignVertical,
  width
}) => {
  return (
    <>
      <Text
        style={{
          backgroundColor: backgroundColor ? backgroundColor : 'transparent',
          borderColor: borderColor ? borderColor : "transparent",
          borderRadius: borderRadius ? borderRadius : 5,
          borderWidth: borderWidth ? borderWidth : 0,
          color: color ? color : 'white',
          fontSize: fontSize ? fontSize : 14,
          height: height && height,
          margin: margin ? margin : 0,
          marginHorizontal: marginHorizontal ? marginHorizontal : 0,
          marginLeft: marginLeft ? marginLeft : 0,
          marginRight: marginRight ? marginRight : 0,
          marginVertical: marginVertical ? marginVertical : 0,
          padding: padding ? padding : 0,
          paddingHorizontal: paddingHorizontal ? paddingHorizontal : 0,
          paddingLeft: paddingLeft ? paddingLeft : 0,
          paddingRight: paddingRight ? paddingRight : 0,
          paddingVertical: paddingVertical ? paddingVertical : 0,
          textAlign: textAlign ? textAlign : "center",
          textAlignVertical: textAlignVertical ? textAlignVertical : 'center',
          width: width && width
        }}>
        {children}
      </Text>
    </>
  );
};

export default TextCustom;
