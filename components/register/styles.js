import { Text, StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  body: {
    flexDirection: 'column',
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  top:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon:{
    width : 130,
    height: 130,
    backgroundColor: '#cccccc',
    borderRadius: 100,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#00a9e0',
    borderStartWidth: 5,
    borderBottomWidth: 5,
  },
  imgIcon:{
    width: 125,
    height: 125,
  },
  iconText:{
    fontSize: 35,
    fontWeight: 'bold',
    // color: '#00a9e0',
    color: '#fff'
  },

  buttom:{
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderInput:{
    height : '90%',
    width: '90%',
    // backgroundColor: '#fff',
    // marginBottom: 50,
    // borderWidth: 0.5,
    borderColor: '#2290b3',
    // borderBottomEndRadius: 70,
    // borderTopLeftRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    // borderStartWidth: 5,
    // borderBottomWidth: 5,
  },
  addTask:{
    // marginTop: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewInput:{
    // width: '100%',
    // height: 30,
    // flexDirection: 'row',
  },
  input:{
    marginBottom: 20,
    height: 44,
    width: 300,
    // backgroundColor: '#fff',
    borderColor: '#FFFFFF', // Màu viền
    borderWidth: 1, // Độ dày viền
    // borderWidth: 1,
    borderRadius: 5,
    // borderTopLeftRadius: 30,
    // borderBottomLeftRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'center',
  },
  imgVisible:{
    width: 23,
    height: 27,
    position: 'absolute',
    right: 3,
    marginTop: 4,
    marginRight: 10,
  },
  iconWrapper1:{
    width: 250,
    height: 44,
    backgroundColor: '#00a9e0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: color.background
    marginBottom: 15,
  },
  iconWrapper2:{
    width: 150,
    height: 44,
    backgroundColor: '#003865',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: color.background
    marginBottom: 10,
  },
  buttonLogin:{
    fontSize: 20,
    color: '#fff',
  },
})

export default styles