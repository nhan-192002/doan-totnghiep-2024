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
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import { database, auth } from "./../../firebase";
import { child, ref, set } from "firebase/database";
// import login from "../../entity/aut";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AuthController from "../../controller/AuthController";


const AppLogin = ({ navigation }) => {
  const [getPasswordVisible, setPasswordVisible] = useState(false);
  const [Email, setEmail] = useState("");
  const [Pass, setPass] = useState("");
  const dbConnet = ref(database);

  const login = () => {
    if (Email.length === 0 || Pass.length === 0) {
      Alert.alert("Thông báo!!", "Vui lòng nhập email hoặc passWord", [
        {
          text: "OK",
        },
      ]);
      return false;
    }

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
  };

  return (
    <View style={styles.body}>
      <ImageBackground
        source={require("@expo/../../img/background2.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.top}>
          <View style={styles.icon}>
            <Image
              style={styles.imgIcon}
              source={require("@expo/../../img/loginIcon.png")}
            />
          </View>
          <Text style={styles.iconText}>Đăng Nhập</Text>
        </View>

        <View style={styles.buttom}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={85}
            style={styles.addTask}
          >
            <View style={styles.borderInput}>
              <View>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Tài Khoản"
                  style={styles.input}
                  value={Email}
                  onChangeText={(text) => setEmail(text)}
                />
              </View>
              <View>
                <TextInput
                  value={Pass}
                  onChangeText={(text) => setPass(text)}
                  autoCapitalize="none"
                  secureTextEntry={getPasswordVisible ? false : true}
                  placeholder="Mật Khẩu"
                  style={styles.input}
                />
                <TouchableOpacity
                  style={styles.imgVisible}
                  onPress={() => {
                    setPasswordVisible(!getPasswordVisible);
                  }}
                >
                  {getPasswordVisible ? (
                    <Image
                      resizeMode="contain"
                      style={styles.imgVisible}
                      source={require("../../img/noninvisible.png")}
                    />
                  ) : (
                    <Image
                      resizeMode="contain"
                      style={styles.imgVisible}
                      source={require("../../img/invisible.png")}
                    />
                  )}
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
      </ImageBackground>
    </View>
  );
};

export default AppLogin;
