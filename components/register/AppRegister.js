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
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { firebase, database, auth } from "../../firebase";
import { child, ref, set } from "firebase/database";
import AuthController from "../../controller/AuthController";

const AppRegister = ({ navigation }) => {
  const [getPasswordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Pass, setPass] = useState("");
  const [Pass2, setPass2] = useState("");

  // const todoRef = firebase.firestore().collection("newData");

  const register = async () => {
    if (
      Email.length == 0 ||
      Pass.length == 0 ||
      Pass2.length == 0 ||
      name.length == 0
    ) {
      Alert.alert("Thông báo!!", "Vui lòng nhập họ tên, email hoặc passWord", [
        {
          text: "OK",
        },
      ]);
      return false;
    } else if (Pass.length < 6 || Pass2.length < 6) {
      Alert.alert("Thông báo!!", "vui lòng nhập pass từ 6 ký tự trở lên", [
        {
          text: "OK",
        },
      ]);
      return false;
    } else if (Pass != Pass2) {
      Alert.alert("Thông báo!!", "mật khẩu chưa trùng", [
        {
          text: "OK",
        },
      ]);
      return false;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, Email, Pass)
      .then(() => {
        // đăng nhập vào Firebase và lấy thông tin của user hiện tại

        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
          time: timestamp,
          name: name,
          email: Email,
          userImg: "",
          about: "",
          phone: "",
          country: "",
          city: "",
          follow:[],
          uid: auth.currentUser.uid,
        };
        
        AuthController.register(auth.currentUser.uid, data)
          .then(() => {
            Keyboard.dismiss();
            setEmail("");
            setPass("");
            setPass2("");
            setName("");
            Alert.alert("Thông báo!!", "đăng ký thành công ", [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("AppLogin");
                },
              },
            ]);
          })
          .catch((error) => {
            alert(error);
          });
      })

      .catch((error) => {
        Alert.alert("Thông báo!!", "Kiểm tra mật khẩu hoặc tài khoản ", [
          {
            text: "OK",
          },
        ]);
        console.log(error);
      });
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
          <Text style={styles.iconText}>Đăng Ký</Text>
        </View>

        <View style={styles.buttom}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={210}
            style={styles.addTask}
          >
            <View style={styles.borderInput}>
              <View>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Họ và tên"
                  style={styles.input}
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
              </View>
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

              <View>
                <TextInput
                  value={Pass2}
                  onChangeText={(text) => setPass2(text)}
                  autoCapitalize="none"
                  secureTextEntry={getPasswordVisible ? false : true}
                  placeholder="Nhập Lại Mật Khẩu"
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

              <TouchableOpacity
                onPress={register}
                // onPress={addField}
              >
                <View style={styles.iconWrapper1}>
                  <Text style={styles.buttonLogin}>Đăng ký</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AppLogin");
                }}
              >
                <View style={styles.iconWrapper2}>
                  <Text style={styles.buttonLogin}>Đăng nhập</Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default AppRegister;
