import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  scrollviewContainer: {
    // backgroundColor: '#081c15',
    // backgroundColor: '#171717',
    backgroundColor: '#006494',
  },

  // MODAL FROM HERE
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    height: "auto",
    backgroundColor: '#333',
    borderRadius: 5,
    paddingVertical: 50,
    paddingHorizontal: 35,
    alignItems: 'center',
    justifyContent: "center",
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
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  modalErrorText: {
    color: 'coral',
    fontSize: 17
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
});
