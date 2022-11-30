import {StyleSheet} from 'react-native';
import { clr } from './elements';

export const modalStyle = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    height: 'auto',
    backgroundColor: clr.gray1,
    borderRadius: 5,
    paddingVertical: 50,
    paddingHorizontal: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 20,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 25,
    elevation: 5,
  },
  // buttonOpen: {
  //   backgroundColor: '#F194FF',
  // },
  buttonClose: {
    backgroundColor: clr.blue,
  },
  modalErrorText: {
    color: clr.tabsActiveColor,
    fontSize: 17,
  },
  textStyle: {
    color: clr.textLight,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    color: clr.textLight,
    marginBottom: 10,
    textAlign: 'center',
  },
});
