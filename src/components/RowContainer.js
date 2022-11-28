import React, {Children} from 'react';
import {View, StyleSheet} from 'react-native';

const RowContainer = ({justifyContent, alignItems, children}) => {
  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: justifyContent ? justifyContent : 'center',
          alignItems: alignItems ? alignItems : 'center',
        },
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 2,
    width: '100%',
  },
});

export default RowContainer;
