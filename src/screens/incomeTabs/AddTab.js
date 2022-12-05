import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  Button,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import ColumnContainer from '../../components/ColumnContainer';
import RowContainer from '../../components/RowContainer';
import TextCustom from '../../components/TextCustom';
import ButtonCustom from '../../components/ButtonCustom';
import DatePicker from 'react-native-date-picker';
import {modalStyle} from '../../customStyles/modal';
import {data as old} from '../../lib/data';
import CardContainer from '../../components/CardContainer';
import SQLite from 'react-native-sqlite-storage';
import {clr} from '../../customStyles/elements';

const db = SQLite.openDatabase(
  {
    name: 'rn_mocanu.db',
    location: 'default',
  },
  () => {
    () => console.log('Database opened.');
  },
  error => console.log(error),
);

const AddTab = () => {
  const initialValues = {
    id: '',
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    income: '',
    details: '',
    description: '',
  };

  const initialValuesModals = {
    modalState: false,
    detailsInvalid: false,
    modalMessage: '',
    modalMessageKey: '',
  };

  const [newItem, setNewItem] = useState(initialValues);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedWeekday, setSelectedWeekday] = useState('Friday');
  const [modal, setModal] = useState(initialValuesModals);
  const [tempState, setTempState] = useState(0);

  useEffect(() => {
    checkWeekDay(new Date());
    createTable();
  }, []);

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        `create table if not exists income (id text, dt text, income real, details text, description text)`,
      );
    });
  };

  const checkWeekDay = item => {
    switch (item.getDay()) {
      case 0:
        setSelectedWeekday(prev => 'Sunday');
        break;
      case 1:
        setSelectedWeekday(prev => 'Monday');
        break;
      case 2:
        setSelectedWeekday(prev => 'Tuesday');
        break;
      case 3:
        setSelectedWeekday(prev => 'Wednesday');
        break;
      case 4:
        setSelectedWeekday(prev => 'Thursday');
        break;
      case 5:
        setSelectedWeekday(prev => 'Friday');
        break;
      case 6:
        setSelectedWeekday(prev => 'Saturday');
        break;
      default:
        setSelectedWeekday(prev => '-');
        break;
    }
  };

  const eraseValue = text => {
    setNewItem({...newItem, [text]: ''});
  };

  const getId = () => {
    const rnd = (Math.random() * 100000).toFixed();
    const tmp = Date.now();
    const finalId = tmp + rnd.toString();
    return finalId;
  };

  const setDatesHandler = item => {
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
        modalMessageKey: 'Income',
        modalMessage: ' empty.',
      });
      return;
    }
    // if (newItem.income.includes(',') || isNaN(+newItem.income)) {
    //   setModal({
    //     ...modal,
    //     modalState: true,
    //     modalMessageKey: 'Income',
    //     modalMessage: ' is not a number.',
    //   });
    //   return;
    // }
    const income = +newItem.income;
    const details = newItem.details.trim();
    if (!details) {
      setModal({
        ...modal,
        modalState: true,
        modalMessageKey: 'Details',
        modalMessage: ' is empty.',
      });
      return;
    }
    let description = newItem.description.trim();
    if (!description) {
      description = '-';
    }
    prepareDataToSave(income, details, description);
  };

  const prepareDataToSave = (income, details, description) => {
    const id = getId();
    const inc = income;
    const det = details;
    const desc = description;
    const day = newItem.day < 10 ? '0' + newItem.day : newItem.day;
    const month = newItem.month < 10 ? '0' + newItem.month : newItem.month;
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

  const toDb = () => {
    setTempState(prev => 0);
    deleteFromIncome();
    old.forEach((item, index) => {
      setTempState(prev => index + 1);
      const id = item.id;
      const date = item.dt;
      const income = item.income;
      const details = item.details;
      const description = item.other;
      const tempObj = {id, income, details, description, date};
      addDataToDB(tempObj);
    });
  };

  const addDataToDB = async fullFinalItem => {
    const {id, date, income, details, description} = fullFinalItem;
    await db.transaction(tx => {
      tx.executeSql(
        'insert into income (id,dt,income,details,description) values (?,?,?,?,?)',
        [id, date, income, details, description],
      );
      clearData();
    });
  };

  const deleteFromIncome = async () => {
    await db.transaction(tx => {
      tx.executeSql('delete from income', [], () =>
        console.log('deleted from income'),
      );
    });
  };

  const checkIncomeDb = async () => {
    await db.transaction(tx => {
      tx.executeSql('select * from income', [], (a, res) => {
        const len = res.rows.length;
        console.log(len);
      });
    });
  };

  const handleIncome = x => {
    const tempX = x.replace(/[^0-9]/g, '');
    setNewItem({...newItem, income: tempX});
  };

  return (
    <ScrollView style={styles.container}>
      {/* <View
        style={{
          flexDirection: 'row',
          borderWidth: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Button title="From old to db" onPress={toDb} />
        <Button title="Delete income" onPress={deleteFromIncome} />
        <Button title="Check" onPress={checkIncomeDb} />
        <Text style={{color: 'white'}}>{tempState}</Text>
      </View> */}
      <CardContainer>
        {/* TOP CONTAINER */}
        <ColumnContainer>
          <TextCustom>Choose date</TextCustom>
          <View
            style={{
              width: '100%',
            }}>
            <Pressable onPress={() => setOpen(true)}>
              <TextCustom
                backgroundColor={clr.textLight}
                color={clr.bgPrimary}
                height={30}>
                {selectedWeekday},
                {newItem.day < 10 ? '0' + newItem.day : newItem.day}.
                {newItem.month < 10 ? '0' + newItem.month : newItem.month}.
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
            onChangeText={text => handleIncome(text)}
            keyboard="number-pad"
            eraseValue={() => eraseValue('income')}
            maxLength={10}
          />
        </ColumnContainer>
        <ColumnContainer>
          <TextCustom>From</TextCustom>
          <CustomInput
            placeholder="details"
            value={newItem.details}
            width="100%"
            onChangeText={text => setNewItem({...newItem, details: text})}
            eraseValue={() => eraseValue('details')}
            maxLength={100}
          />
        </ColumnContainer>
        <ColumnContainer>
          <TextCustom>Notes (Optional)</TextCustom>
          <CustomInput
            placeholder="description"
            value={newItem.description}
            width="100%"
            onChangeText={text => setNewItem({...newItem, description: text})}
            eraseValue={() => eraseValue('description')}
            maxLength={250}
          />
        </ColumnContainer>

        {/* BOTTOM CONTAINER */}
        <RowContainer justifyContent="space-between">
          <ButtonCustom
            title="Clear fields"
            onPress={clearData}
            color={clr.bgPrimary}
            backgroundColor={clr.textLight}
          />
          <ButtonCustom title="Add new data" onPress={checkInputs} />
        </RowContainer>

        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={item => setDatesHandler(item)}
          onCancel={() => {
            setOpen(false);
          }}
          mode="date"
          theme="light"
          title="Choose date or leave current"
          textColor={clr.textLight}
          maximumDate={new Date()}
          minimumDate={new Date('1980-01-01')}
        />

        {/* INVALID INCOME */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modal.modalState}
          onRequestClose={() => {
            setModal({...modal, modalState: false});
          }}>
          <View style={modalStyle.centeredView}>
            <View style={modalStyle.modalView}>
              <Text style={modalStyle.modalText}>
                "
                <Text style={modalStyle.modalErrorText}>
                  {modal.modalMessageKey}
                </Text>
                " {modal.modalMessage}
              </Text>
              <Pressable
                style={[modalStyle.button, modalStyle.buttonClose]}
                onPress={() => setModal({...modal, modalState: false})}>
                <Text style={modalStyle.textStyle}>Ok</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </CardContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: clr.bgPrimary,
  },
});

export default AddTab;
