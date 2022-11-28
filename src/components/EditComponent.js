import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable, Button } from "react-native";
import CustomInput from "./CustomInput";
import DatePicker from "react-native-date-picker";
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



/* 
Receives: 
1. state for open(show) component
2. getData for refresh data after edit
3. state of current item (setItemToEdit, itemToEdit)
*/


const EditComponent = ({ setOpenEdit, getData, setItemToEdit, itemToEdit }) => {
  const [open, setOpen] = useState(false);

  const saveEdited = () => {
    if (!itemToEdit.income) {
      console.log("No income")
      return;
    }
    if (itemToEdit.income.toString().includes(",") || isNaN(+itemToEdit.income)) {
      console.log("Income incorrect or not a integer.")
      return;
    }
    const income = +itemToEdit.income;
    const details = itemToEdit.details.trim();
    if (!details) {
      console.log("No details.")
      return;
    }
    let description = itemToEdit.description;
    setItemToEdit(prev=>({ ...prev, income, details, description: description ? description : "nimic" }));
    addData();
  };

  const eraseValue = (key) => {
    setItemToEdit({ ...itemToEdit, [key]: "" });
  };

  const setNewDate = (item) => {
    setOpen(false);
    const day = item.getDate();
    const month = +item.getMonth() + 1;
    const year = item.getFullYear();
    const newDate = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
    setItemToEdit({ ...itemToEdit, dt: newDate });
  };

  const addData = async () => {
    console.log("addData EditComponent: ",itemToEdit);
    const { id, dt, income, details, description } = itemToEdit;
    await db.transaction((tx) => {
      tx.executeSql(
        "update income set id=?,dt=?,income=?,details=?,description=? where id=?",
        [id, dt, income, details, description, id],
        () => console.log("Update successful."),
        (error) => console.log("Error: ", error.message)
      );
    });
    getData();
  };

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.textInputContainer}>
        <Text style={styles.textInput}>Date:</Text>
        <Pressable onPress={() => setOpen(true)}>
          <Text style={styles.textAsInput}>{itemToEdit.dt}</Text>
        </Pressable>
      </View>
      <View style={styles.textInputContainer}>
        <Text style={styles.textInput}>Income:</Text>
        <CustomInput
          width="100%"
          value={`${itemToEdit.income}`}
          eraseValue={() => eraseValue("income")}
          onChangeText={(text) => setItemToEdit({ ...itemToEdit, income: text })}
          maxLength={10}
        />
      </View>

      
      <View style={styles.textInputContainer}>
        <Text style={styles.textInput}>From:</Text>
        <CustomInput
          width="100%"
          value={`${itemToEdit.details}`}
          eraseValue={() => eraseValue("details")}
          onChangeText={(text) => setItemToEdit({ ...itemToEdit, details: text })}
          maxLength={100}
        />
      </View>
      <View style={styles.textInputContainer}>
        <Text style={styles.textInput}>Notes: (Optional)</Text>
        <CustomInput
          width="100%"
          value={`${itemToEdit.description}`}
          eraseValue={() => eraseValue("description")}
          onChangeText={(text) => setItemToEdit({ ...itemToEdit, description: text })}
          maxLength={250}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <Button title="Cancel" onPress={() => setOpenEdit(false)} />
        <Button title="Save Edited" onPress={saveEdited} />
      </View>

      <DatePicker
        modal
        open={open}
        date={new Date()}
        onConfirm={(item) => setNewDate(item)}
        onCancel={() => {
          setOpen(false);
        }}
        mode="date"
        theme="light"
        title="Pick a date, please!"
        textColor="#006494"
        maximumDate={new Date()}
        minimumDate={new Date("1980-01-01")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    color: "white",
  },
  textAsInput: {
    color: "#006494",
    backgroundColor: "#ccc",
    borderRadius: 5,
    width: "100%",
    textAlign: "center",
    height: 30,
    textAlignVertical: "center",
  },
});

export default EditComponent;
