import React, {Children} from 'react';
import {View, StyleSheet} from 'react-native';

const ColumnContainer = ({justifyContent, alignItems, children}) => {
  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: justifyContent ? justifyContent : 'center',
          alignItems: alignItems ? alignItems : 'flex-start',
        },
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 2
  },
});

export default ColumnContainer;
