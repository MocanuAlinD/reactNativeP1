import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Text, FlatList, RefreshControl,ActivityIndicator } from "react-native";
import FlatItem from "../../components/FlatItem";
import SQLite from "react-native-sqlite-storage";
import EditComponent from "../../components/EditComponent";
import { tabsContainers } from "../../customStyles/elements";

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

const ViewTab = () => {
  const initialValues = {
    income: 0,
    dt: "",
    details: "",
    description: "",
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(initialValues);

  useEffect(() => {
    getData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    wait(50).then(() => setRefreshing(false));
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const getData = async () => {
    setLoading((prev) => true);
    setData([]);
    const tempList = [];
    await db.transaction((tx) => {
      tx.executeSql("select * from income", [], (tx, results) => {
        let len = results.rows.length;
        for (let i = 0; i < len; i++) {
          const item = results.rows.item(i);
          tempList.push(item);
        }
        setData(tempList.reverse());
        setLoading(false);
        setOpenEdit(false);
      });
    });
  };


  const handleEditItem = (x) => {
    const aln = data.filter((itm) => itm.id === x)[0];
    setItemToEdit(aln);
    setOpenEdit(true);
  };

  return (
    <View style={tabsContainers}>
      {openEdit && (
        <EditComponent
        setOpenEdit={setOpenEdit}
        getData={getData}
        setItemToEdit={setItemToEdit}
        itemToEdit={itemToEdit}
      />
      )}

      {!loading ? (
        <View style={styles.bottomContainer}>
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <FlatItem
                item={item}
                idx={index}
                handleEditItem={handleEditItem}
                getData={getData}
              />
            )}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            width: "100%",
          }}
        >
          <ActivityIndicator size="large" color="#f5cb5c" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    width: "100%",
    flex: 1,
  },
});

export default ViewTab;
