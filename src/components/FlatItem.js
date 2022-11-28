import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import SQLite from "react-native-sqlite-storage";

const db = SQLite.openDatabase(
  {
    name: "rn_mocanu.db",
    location: "default",
  },
  () => {
    () => console.log("Database opened.");
  },
  (error) => console.log(error)
);

const FlatItem = ({ item, idx, getData, handleEditItem }) => {

  const deleteItem = async (x) => {
    if (x === item.id) {
      console.log("Same id");
      await db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM income WHERE id=?",
          [x],
          () => console.log("Deleted !"),
          (error) => console.log("Some error occured.", error.message)
        );
      });
      getData();
      return;
    }
    await db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM income WHERE id=?",
        [x],
        () => console.log("Deleted !"),
        (error) => console.log("Some error occured.", error.message)
      );
    });
    getData();
  };
  return (
    <View style={styles.flatContainer}>
      <View style={styles.left}>
        <Text style={[styles.flatItem, { color: "white" }]}>{idx + 1}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.flatItem}>
          <Text style={styles.innerText}>Income:</Text> {item.income}
        </Text>
        <Text style={styles.flatItem}>
          <Text style={styles.innerText}>Date:</Text> {item.dt}
        </Text>
        <Text style={styles.flatItem}>
          <Text style={styles.innerText}>From:</Text> {item.details}
        </Text>
        <Text style={styles.flatItem}>
          <Text style={styles.innerText}>Notes:</Text> {item.description}
        </Text>
        
      </View>
      <Pressable style={styles.editIcon} onPress={() => handleEditItem(item.id)}>
        <Icon name="edit" color="white" size={20} />
      </Pressable>
      <Pressable style={styles.deleteIcon} onPress={() => deleteItem(item.id)}>
        <Icon name="delete-outline" color="coral" size={20} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  flatContainer: {
    marginBottom: 5,
    padding: 5,
    flexDirection: "row",
    backgroundColor: "#252525",
    borderRadius: 5,
  },
  flatItem: {
    color: "white",
    fontSize: 10,
  },
  left: {
    paddingHorizontal: 0,
    borderRightWidth: 0.5,
    borderRightColor: "white",
    width: 31,
  },
  right: {
    flex: 1,
    marginLeft: 5,
    marginRight: 35,
  },
  innerText: {
    color: "coral",
  },
  editIcon: {
    position: "absolute",
    top: 5,
    right: 0,
    height: "100%",
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: "80%",
    width: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FlatItem;
