import {StatusBar} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Main from './src/screens/Main';
import IncomeScreen from './src/screens/IncomeScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Income"
          component={IncomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Expenses"
          component={ExpensesScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      {/* <Stack.Navigator>
        <Stack.Screen
            name="Main"
            component={Main}
            options={{ headerShown: false }}
          />
      </Stack.Navigator> */}
      {/* <Text>Alin</Text> */}
    </NavigationContainer>
  );
}
