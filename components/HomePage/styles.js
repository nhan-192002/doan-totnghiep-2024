import { Text, StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
    viewlAll: {
    alignItems: "center",
    justifyContent: "center",
  },

  menuTop: {
    width: "100%",
    height: 50,
    // flex: 1,
    // backgroundColor: 'red'
  },
  taskbar: {
    flex: 1,
    width: "100%",
    // borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginTop: 40,
    // backgroundColor: "#003865",
    paddingHorizontal: 15,
  },
  imgback: {
    width: 30,
    height: 30,
  },
  textMenutop: {
    fontSize: 25,
    fontWeight: "bold",
  },
  imgback1: {
    width: 30,
    height: 30,
  },

  viewScol: {
    width: "100%",
    height: "38%",
    // backgroundColor: '#eeeeee',
    backgroundColor: 'red',
    borderRadius: 10,
  },

  imgUser: {
    width: "100%",
    flex: 3,
    // backgroundColor: 'yellow'
    flexDirection: "row",
    alignItems: "center",
  },
  imgUser1: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 100,
  },
  textUser1:{
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10
  },


  text: {
    width: "100%",
    flex: 3,
    // backgroundColor: "red",
    marginTop: 10,
    // marginBottom: 10,
  },
  textInput:{
    padding: 10,
    fontSize: 18,
  },



  imgupdate: {
    width: "100%",
    flex: 3,
    // backgroundColor: "yellow",
    height: 300,
    borderRadius: 5,
    flexDirection: "column-reverse",
    
  },
  closeImg:{
    position: 'absolute',
    width: 30,
    height: 30,
    right: 0,
  },
  imgupdate1:{
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    // resizeMode: "stretch",
    // aspectRatio: 200,
  },



  allMenuButtom:{
    flexDirection: "row",
    flex:1,
    // marginBottom: 150,
    flexDirection: 'row',
    // paddingHorizontal: 20,
    justifyContent: "space-between",

  },
  menuBottom: {
    width: "100%",
    flex: 1,
    // backgroundColor: "red",
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: 'row'
    width: 120,
    height: 40,
    // // backgroundColor: 'red',
    // // marginLeft: 1,
    // borderRightWidth: 1,
    // // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderLeftWidth: 1,
    // // marginTop: 10,
  },
  uploadImg:{
    width: 30,
    height: 30,
    // marginRight: 10,
  },
  uploadImg1:{
    width: 30,
    height: 30,
    // marginRight: 10,
  },
  uploadImg2:{
    width: 30,
    height: 30,
    // marginRight: 10,
  },
});
export default styles;