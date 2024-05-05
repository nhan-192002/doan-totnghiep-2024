import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Setting = ({navigation}) => {
  return (
    <SafeAreaView style={{ flex: 1, width: "100%", height: "100%" }}>
      <View style={styles.taskbar}>
        <TouchableOpacity
          onPress={() => {
            navigation.pop(2);
          }}
        >
          <Image
            source={require("../../img/backicon.png")}
            style={styles.imgback}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity>
              <Image
                source={require("../../img/settings_icon.png")}
                style={styles.imgback1}
              />
            </TouchableOpacity> */}
      </View>
      <View style={styles.body}>
        <Text style={styles.textHome}>Home</Text>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskbar: {
    flex: 1,
    width: "100%",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginTop: 40,
    backgroundColor: "#003865",
  },
  textHome: {
    fontSize: 24,
  },
  imgback: {
    width: 50,
    height: 50,
  },
  imgback1: {
    width: 50,
    height: 50,
  },
  body: {
    flex: 9,
    width: "100%",
    // backgroundColor: 'yellow',
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Setting;
