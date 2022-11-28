import React from "react";
import { View, Button, Text, StyleSheet, StatusBar } from "react-native";

const ExpensesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topBar}>
        <View style={styles.buttonContainer}>
          <Button title="<-" onPress={() => navigation.navigate("Main")} />
        </View>
        <Text style={styles.barText}>Expenses page</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barText: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 25,
  },
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "red",
    justifyContent: "flex-start",
    padding: 7,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: "red",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20
  }
});

export default ExpensesScreen;
