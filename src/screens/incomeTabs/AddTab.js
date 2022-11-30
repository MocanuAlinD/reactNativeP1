import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Modal, ScrollView, Button, ActivityIndicator } from "react-native";
import { tabsBackground } from "../../customStyles/containers";
import CustomInput from "../../components/CustomInput";
import ColumnContainer from "../../components/ColumnContainer";
import RowContainer from "../../components/RowContainer";
import TextCustom from "../../components/TextCustom";
import ButtonCustom from "../../components/ButtonCustom";
import DatePicker from "react-native-date-picker";
import { styles } from "../../customStyles/addTabStyle";
import { data as old } from "../../lib/data";
import CardContainer from "../../components/CardContainer";
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

const AddTab = () => {
  const initialValues = {
    id: "",
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    income: "",
    details: "",
    description: "",
  };

  const initialValuesModals = {
    modalState: false,
    detailsInvalid: false,
    modalMessage: "",
    modalMessageKey: "",
  };

  const [newItem, setNewItem] = useState(initialValues);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedWeekday, setSelectedWeekday] = useState("Friday");
  const [modal, setModal] = useState(initialValuesModals);
  const [tempListAlin, setTempListAlin] = useState([])

  useEffect(() => {
    checkWeekDay(new Date());
    createTable();
  }, []);

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `create table if not exists income (id text, dt text, income real, details text, description text)`
      );
    });
  };

  const checkWeekDay = (item) => {
    switch (item.getDay()) {
      case 0:
        setSelectedWeekday((prev) => "Sunday");
        break;
      case 1:
        setSelectedWeekday((prev) => "Monday");
        break;
      case 2:
        setSelectedWeekday((prev) => "Tuesday");
        break;
      case 3:
        setSelectedWeekday((prev) => "Wednesday");
        break;
      case 4:
        setSelectedWeekday((prev) => "Thursday");
        break;
      case 5:
        setSelectedWeekday((prev) => "Friday");
        break;
      case 6:
        setSelectedWeekday((prev) => "Saturday");
        break;
      default:
        setSelectedWeekday((prev) => "-");
        break;
    }
  };

  const eraseValue = (text) => {
    setNewItem({ ...newItem, [text]: "" });
  };

  const getId = () => {
    const rnd = (Math.random() * 100000).toFixed();
    const tmp = Date.now();
    const finalId = tmp + rnd.toString();
    return finalId;
  };

  const setDatesHandler = (item) => {
    setOpen(false);
    setDate(item);
    checkWeekDay(item);
    setNewItem({
      ...newItem,
      day: item.getDate(),
      month: +item.getMonth() + 1,
      year: item.getFullYear(),
    });
  };

  const clearData = () => {
    setNewItem(initialValues);
    checkWeekDay(new Date());
  };

  const checkInputs = () => {
    if (!newItem.income) {
      setModal({
        ...modal,
        modalState: true,
        modalMessageKey: "Income",
        modalMessage: " empty.",
      });
      return;
    }
    if (newItem.income.includes(",") || isNaN(+newItem.income)) {
      setModal({
        ...modal,
        modalState: true,
        modalMessageKey: "Income",
        modalMessage: " is not a number.",
      });
      return;
    }
    const income = +newItem.income;
    const details = newItem.details.trim();
    if (!details) {
      setModal({
        ...modal,
        modalState: true,
        modalMessageKey: "Details",
        modalMessage: " is empty.",
      });
      return;
    }
    let description = newItem.description.trim();
    if (!description) {
      description = "-";
    }
    prepareDataToSave(income, details, description);
  };

  const prepareDataToSave = (income, details, description) => {
    const id = getId();
    const inc = income;
    const det = details;
    const desc = description;
    const day = newItem.day < 10 ? "0" + newItem.day : newItem.day;
    const month = newItem.month < 10 ? "0" + newItem.month : newItem.month;
    const year = newItem.year.toString();
    const fullDate = `${year}-${month}-${day}`;
    const finalItem = {
      id: id,
      income: inc,
      details: det,
      description: desc,
      date: fullDate,
    };
    addDataToDB(finalItem);
  };

  const addDataToDB = async (fullFinalItem) => {
    const { id, date, income, details, description } = fullFinalItem;
    await db.transaction((tx) => {
      tx.executeSql(
        "insert into income (id,dt,income,details,description) values (?,?,?,?,?)",
        [id, date, income, details, description]
      );
      clearData();
    });
  };

  const toDb = () => {
    old.forEach(item => {
      const id = item.id;
      const date = item.dt;
      const income = item.income;
      const details = item.details;
      const description = item.other;
      const tempObj = { id, income, details, description, date };
      addDataToDB(tempObj);
    });
  };

  return (
    <ScrollView style={styles.scrollviewContainer}>
      <View style={{ flexDirection: "row" }}>
        {/* <Button title="See data" onPress={getData} /> */}
        {/* <Button title="Create table" onPress={createTable} /> */}
        {/* <Button title="Delete table" onPress={() => deleteTable('income')} /> */}
        {/* <Button title="Delete entry" onPress={deleteData} /> */}
        <Button title="From old to db" onPress={toDb} />
      </View>
      <CardContainer>
        {/* TOP CONTAINER */}
        <ColumnContainer>
          <TextCustom>Choose date</TextCustom>
          <View
            style={{
              width: "100%",
            }}
          >
            <Pressable onPress={() => setOpen(true)}>
              <TextCustom backgroundColor="#ccc" color="#006494" height={30}>
                {selectedWeekday},
                {newItem.day < 10 ? "0" + newItem.day : newItem.day}.
                {newItem.month < 10 ? "0" + newItem.month : newItem.month}.
                {newItem.year}
              </TextCustom>
            </Pressable>
          </View>
        </ColumnContainer>

        {/* MIDDLE CONTAINER */}
        <ColumnContainer>
          <TextCustom>Income</TextCustom>
          <CustomInput
            placeholder="income"
            value={newItem.income}
            width="100%"
            onChangeText={(text) => setNewItem({ ...newItem, income: text })}
            keyboard="numeric"
            eraseValue={() => eraseValue("income")}
            maxLength={10}
          />
        </ColumnContainer>
        <ColumnContainer>
          <TextCustom>From</TextCustom>
          <CustomInput
            placeholder="details"
            value={newItem.details}
            width="100%"
            onChangeText={(text) => setNewItem({ ...newItem, details: text })}
            eraseValue={() => eraseValue("details")}
            maxLength={100}
          />
        </ColumnContainer>
        <ColumnContainer>
          <TextCustom>Notes (Optional)</TextCustom>
          <CustomInput
            placeholder="description"
            value={newItem.description}
            width="100%"
            onChangeText={(text) =>
              setNewItem({ ...newItem, description: text })
            }
            eraseValue={() => eraseValue("description")}
            maxLength={250}
          />
        </ColumnContainer>

        {/* BOTTOM CONTAINER */}
        <RowContainer justifyContent="space-between">
          <ButtonCustom
            title="Clear fields"
            onPress={clearData}
            color="#006494"
            backgroundColor="#ccc5b9"
          />
          <ButtonCustom title="Add new data" onPress={checkInputs} />
        </RowContainer>

        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={(item) => setDatesHandler(item)}
          onCancel={() => {
            setOpen(false);
          }}
          mode="date"
          theme="light"
          title="Pick a date, dude!"
          textColor="#006494"
          maximumDate={new Date()}
          minimumDate={new Date("1980-01-01")}
        />

        {/* INVALID INCOME */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modal.modalState}
          onRequestClose={() => {
            setModal({ ...modal, modalState: false });
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                "
                <Text style={styles.modalErrorText}>
                  {modal.modalMessageKey}
                </Text>
                " {modal.modalMessage}
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModal({ ...modal, modalState: false })}
              >
                <Text style={styles.textStyle}>Ok</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </CardContainer>
    </ScrollView>
  );
};

export default AddTab;
