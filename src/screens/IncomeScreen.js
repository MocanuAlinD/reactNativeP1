import React from 'react';
import {View, Text, StyleSheet, StatusBar, Pressable} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AddTab from "./incomeTabs/AddTab";
import ViewTab from "./incomeTabs/ViewTab";
import SearchTab from "./incomeTabs/SearchTab";
import ByYMDTab from "./incomeTabs/ByYMDTab";
import ExportAllTab from "./incomeTabs/ExportAllTab";
import IconNavbar from '../components/IconNavbar';
import { clr } from '../customStyles/elements';

const Tab = createMaterialTopTabNavigator();

const IncomeScreen = ({navigation}) => {

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.navigate('Main')}
          style={{paddingHorizontal: 20, paddingVertical: 10}}>
          <IconNavbar iconName="arrow-back" />
        </Pressable>
        <Text style={styles.text}>Income</Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: clr.textLight,
          tabBarInactiveTintColor: "#ffffff77",
          tabBarStyle: { backgroundColor: clr.bgPrimary },
          tabBarIndicatorStyle: { backgroundColor: clr.tabsActiveColor },
          tabBarScrollEnabled: true,
          tabBarPressColor: "#ffffff22",
          tabBarItemStyle: { width: 100 },
        }}
      >
        <Tab.Screen name="Add" component={AddTab} />
        <Tab.Screen name="View" component={ViewTab} />
        <Tab.Screen name="Search" component={SearchTab} />
        <Tab.Screen name="ByYMD" component={ByYMDTab} />
        <Tab.Screen name="Export" component={ExportAllTab} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: clr.bgPrimary,
  },
  tabsContainer: {
    padding: 5,
    width: '100%',
  },
  topBar: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: clr.bgPrimary,
  },
  text: {
    color: clr.textLight,
    fontSize: 25,
    width: '100%',
    textAlign: 'left',
    paddingLeft: 10,
  },
  scrollContainer: {
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: clr.bgPrimary,
  },
});

export default IncomeScreen;
