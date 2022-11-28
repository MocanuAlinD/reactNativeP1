import React from 'react';
import {View, StyleSheet, Pressable, Image, Text, BackHandler} from 'react-native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Main = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.navigate('Settings')}>
          <FontAwesome name="cogs" style={styles.text} />
        </Pressable>
        <Pressable onPress={() => BackHandler.exitApp()}>
          <Ionicons name="exit-outline" style={[styles.text, styles.exit]} />
        </Pressable>
      </View>

      {/* <View style={styles.center}>
        <Pressable
          onPress={() => navigation.navigate('Income')}
          style={styles.imageContainer}>
          <MaterialIcons name="attach-money" color="white" style={{fontSize: 30}} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Income')}
          style={styles.imageContainer}>
          <MaterialIcons name="local-grocery-store" color="white" style={{fontSize: 30}} />
        </Pressable>
      </View> */}

      <View style={styles.center}>
        <Pressable
          onPress={() => navigation.navigate("Income")}
          style={styles.imageContainer}
        >
          <Image
            source={require("../assets/survey.png")}
            style={styles.image}
          />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Expenses")}
          style={styles.imageContainer}
        >
          <Image source={require("../assets/money.png")} style={styles.image} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#006494',
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  imageContainer: {
    width: 70,
    height: 70,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: 'white',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exit: {
    color: '#e76f51',
  },
});

export default Main;
