import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "./../../firebase";

const Home = ({ route, navigation }) => {
    // const {Email} =route.params;
    const {Email,Pass} =route.params;


    const [userId, setUserId] = useState(null);
    useEffect(() => {
      // đăng nhập vào Firebase và lấy thông tin của user hiện tại
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          // nếu user đã đăng nhập thành công, lấy uid của user
          setUserId(user.uid);
        } else {
          setUserId(null);
        }
      });
      // huỷ đăng ký listener khi component bị huỷ
      return () => unsubscribe();
    }, []);

    
  return (
    <SafeAreaView style={{ flex: 1, width: "100%", height: "100%" }}>
      <View style={styles.taskbar}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            source={require("../../img/backicon.png")}
            style={styles.imgback}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Setting");
          }}
        >
          <Image
            source={require("../../img/settings_icon.png")}
            style={styles.imgback1}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Text style={styles.textHome}>Home email: <Text>{Email}</Text></Text>
        <Text style={styles.textHome}>Home pass: <Text>{Pass}</Text></Text>
        <Text style={styles.textHome}>Home id: <Text>{userId}</Text></Text>

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

export default Home;
