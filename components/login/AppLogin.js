import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  border,
  Button,
  Alert,
  useColorScheme ,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import darkModel from "../styles/DarkModel";
import { database, auth } from "./../../firebase";
import { child, ref, set } from "firebase/database";
// import login from "../../entity/aut";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AuthController from "../../controller/AuthController";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const AppLogin = ({ navigation }) => {
  const [getPasswordVisible, setPasswordVisible] = useState(false);
  const [Email, setEmail] = useState("");
  const [Pass, setPass] = useState("");
  const dbConnet = ref(database);
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? darkModel.lightThemeText : darkModel.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? darkModel.lightContainer : darkModel.darkContainer;

  const gradientColors = colorScheme === 'dark' 
    ? ['#434343', '#000000'] // Màu cho chế độ Dark
    : ['#EEEEEE', '#888888']; // Màu cho chế độ Light

  const login = () => {
    // if (Email.length === 0 || Pass.length === 0) {
    //   Alert.alert("Thông báo!!", "Vui lòng nhập email hoặc passWord", [
    //     {
    //       text: "OK",
    //     },
    //   ]);
    //   return false;
    // }

    if(Email != "" && Pass != "")
      {
        AuthController.login(
          Email,
          Pass,
          () => {
            // Đăng nhập thành công
            navigation.navigate("AppStack");
            setEmail("");
            setPass("");
          },
          (error) => {
            // Xử lý lỗi đăng nhập
          }
        );
      }else{
        AuthController.login(
          // Email,
          // Pass,
          'nhan123@gmail.com',
          'nhan123',
          () => {
            // Đăng nhập thành công
            navigation.navigate("AppStack");
            setEmail("");
            setPass("");
          },
          (error) => {
            // Xử lý lỗi đăng nhập
          }
        );
      }
  };

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.body, themeContainerStyle]}>
      {/* <ImageBackground
        source={require("@expo/../../img/background2.jpg")}
        resizeMode="cover"
        style={styles.image}
      > */}
        <View style={styles.top}>
          <View style={styles.icon}>
            <Image
              style={styles.imgIcon}
              source={require("@expo/../../img/logoApp.png")}
            />
          </View>
          <Text style={[styles.iconText, themeTextStyle]}>Welcome to</Text>
        </View>

        <View style={styles.buttom}>
          <KeyboardAvoidingView
            behavior="padding" // Hoặc "height" nếu bạn muốn
            keyboardVerticalOffset={85}
            style={styles.addTask}
          >
            <View style={styles.borderInput}>
              <View>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Tài Khoản"
                  style={[styles.input, themeContainerStyle]}
                  value={Email}
                  onChangeText={(text) => setEmail(text)}
                />
              </View>
              <View>
                <TextInput
                  value={Pass}
                  onChangeText={(text) => setPass(text)}
                  autoCapitalize="none"
                  secureTextEntry={!getPasswordVisible} // Đảo ngược điều kiện
                  placeholder="Mật Khẩu"
                  style={[styles.input, themeContainerStyle]}
                />
                <TouchableOpacity
                  style={styles.imgVisible}
                  onPress={() => {
                    setPasswordVisible(!getPasswordVisible);
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={styles.imgVisible}
                    source={getPasswordVisible 
                      ? require("../../img/noninvisible.png") 
                      : require("../../img/invisible.png")}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => login(Email, Pass)}>
                <View style={styles.iconWrapper1}>
                  <Text style={styles.buttonLogin}>Đăng nhập</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AppRegister");
                }}
              >
                <View style={styles.iconWrapper2}>
                  <Text style={styles.buttonLogin}>Đăng Ký</Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>

      {/* </ImageBackground> */}
    </LinearGradient>
  );
};

export default AppLogin;
