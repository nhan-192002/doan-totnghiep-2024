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
  useColorScheme
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./../login/styles";
import darkModel from "../styles/DarkModel";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";
import { firebase, database, auth } from "../../firebase";
import { child, ref, set } from "firebase/database";
import AuthController from "../../controller/AuthController";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from 'expo-linear-gradient';

const AppRegister = ({ navigation }) => {
  const [getPasswordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Pass, setPass] = useState("");
  const [Pass2, setPass2] = useState("");
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? darkModel.lightThemeText : darkModel.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? darkModel.lightContainer : darkModel.darkContainer;

  const gradientColors = colorScheme === 'dark' 
  ? ['#434343', '#000000'] // Màu cho chế độ Dark
  : ['#EEEEEE', '#888888']; // Màu cho chế độ Light

  // const register = async () => {
  //   if (
  //     Email.length == 0 ||
  //     Pass.length == 0 ||
  //     Pass2.length == 0 ||
  //     name.length == 0
  //   ) {
  //     Alert.alert("Thông báo!!", "Vui lòng nhập họ tên, email hoặc passWord", [
  //       {
  //         text: "OK",
  //       },
  //     ]);
  //     return false;
  //   } else if (Pass.length < 6 || Pass2.length < 6) {
  //     Alert.alert("Thông báo!!", "vui lòng nhập pass từ 6 ký tự trở lên", [
  //       {
  //         text: "OK",
  //       },
  //     ]);
  //     return false;
  //   } else if (Pass != Pass2) {
  //     Alert.alert("Thông báo!!", "mật khẩu chưa trùng", [
  //       {
  //         text: "OK",
  //       },
  //     ]);
  //     return false;
  //   }

  //   const auth = getAuth();
  //   createUserWithEmailAndPassword(auth, Email, Pass)
  //     .then(() => {
  //       // đăng nhập vào Firebase và lấy thông tin của user hiện tại

  //       const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  //       const data = {
  //         time: timestamp,
  //         name: name,
  //         email: Email,
  //         userImg: "",
  //         about: "",
  //         phone: "",
  //         country: "",
  //         city: "",
  //         follow:[],
  //         uid: auth.currentUser.uid,
  //       };
        
  //       AuthController.register(auth.currentUser.uid, data)
  //         .then(() => {
  //           Keyboard.dismiss();
  //           setEmail("");
  //           setPass("");
  //           setPass2("");
  //           setName("");
  //           Alert.alert("Thông báo!!", "đăng ký thành công ", [
  //             {
  //               text: "OK",
  //               onPress: () => {
  //                 navigation.navigate("AppLogin");
  //               },
  //             },
  //           ]);
  //         })
  //         .catch((error) => {
  //           alert(error);
  //         });
  //     })

  //     .catch((error) => {
  //       Alert.alert("Thông báo!!", "Kiểm tra mật khẩu hoặc tài khoản ", [
  //         {
  //           text: "OK",
  //         },
  //       ]);
  //       console.log(error);
  //     });
  // };

  // const register = async () => {
  //   // Kiểm tra đầu vào của form
  //   if (Email.length == 0 || Pass.length == 0 || Pass2.length == 0 || name.length == 0) {
  //     Alert.alert("Thông báo!!", "Vui lòng nhập họ tên, email hoặc mật khẩu", [
  //       { text: "OK" },
  //     ]);
  //     return false;
  //   } else if (Pass.length < 6 || Pass2.length < 6) {
  //     Alert.alert("Thông báo!!", "Vui lòng nhập mật khẩu từ 6 ký tự trở lên", [
  //       { text: "OK" },
  //     ]);
  //     return false;
  //   } else if (Pass !== Pass2) {
  //     Alert.alert("Thông báo!!", "Mật khẩu chưa trùng khớp", [
  //       { text: "OK" },
  //     ]);
  //     return false;
  //   }

  //   // Tạo tài khoản với Firebase Authentication
  //   const auth = getAuth();
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(auth, Email, Pass);
  //     const user = userCredential.user; // Lấy thông tin người dùng sau khi đăng ký

  //     // Gửi email xác thực
  //     await sendEmailVerification(user);
  //     console.log("Đã gửi email xác thực");

  //     // Thêm người dùng vào Firestore
  //     const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  //     const data = {
  //       time: timestamp,
  //       name: name,
  //       email: Email,
  //       userImg: "",
  //       about: "",
  //       phone: "",
  //       country: "",
  //       city: "",
  //       follow: [],
  //       uid: user.uid,
  //     };

  //     // Lưu thông tin người dùng vào Firestore
  //     await firestore().collection("users").doc(user.uid).set(data);

  //     // Reset form sau khi đăng ký thành công
  //     Keyboard.dismiss();
  //     setEmail("");
  //     setPass("");
  //     setPass2("");
  //     setName("");

  //     // Thông báo và chuyển hướng
  //     Alert.alert(
  //       "Thông báo!!",
  //       "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
  //       [
  //         {
  //           text: "OK",
  //           onPress: () => {
  //             navigation.navigate("AppLogin");
  //           },
  //         },
  //       ]
  //     );
  //   } catch (error) {
  //     console.log("Lỗi khi đăng ký: ", error);
  //     Alert.alert("Thông báo!!", "Kiểm tra mật khẩu hoặc tài khoản", [
  //       { text: "OK" },
  //     ]);
  //   }
  // };
  
  const register = async () => {
    if (Email.length == 0 || Pass.length == 0 || Pass2.length == 0 || name.length == 0) {
      Alert.alert("Thông báo!!", "Vui lòng nhập họ tên, email hoặc passWord", [{ text: "OK" }]);
      return false;
    } else if (Pass.length < 6 || Pass2.length < 6) {
      Alert.alert("Thông báo!!", "vui lòng nhập pass từ 6 ký tự trở lên", [{ text: "OK" }]);
      return false;
    } else if (Pass !== Pass2) {
      Alert.alert("Thông báo!!", "mật khẩu chưa trùng", [{ text: "OK" }]);
      return false;
    }
  
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, Email, Pass)
      .then((userCredential) => {
        const user = userCredential.user;
        sendEmailVerification(user)
          .then(() => {
            console.log("Email xác thực đã được gửi");
  
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
              follow: [],
              uid: user.uid,
            };
  
            AuthController.register(user.uid, data)
              .then(() => {
                Keyboard.dismiss();
                setEmail("");
                setPass("");
                setPass2("");
                setName("");
                Alert.alert("Thông báo!!", "đăng ký thành công", [
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
            console.log("Lỗi gửi email xác thực: ", error);
            Alert.alert("Thông báo!!", "Lỗi khi gửi email xác thực", [{ text: "OK" }]);
          });
      })
      .catch((error) => {
        Alert.alert("Thông báo!!", "Kiểm tra mật khẩu hoặc tài khoản", [{ text: "OK" }]);
        console.log("Lỗi đăng ký: ", error);
      });
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
          <Text style={styles.iconText}>Đăng Ký</Text>
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
                  placeholder="Họ và tên"
                  style={[styles.input, themeContainerStyle]}
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
              </View>
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
                  secureTextEntry={getPasswordVisible ? false : true}
                  placeholder="Mật Khẩu"
                  style={[styles.input, themeContainerStyle]}
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
                  style={[styles.input, themeContainerStyle]}
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
      {/* </ImageBackground> */}
    </LinearGradient>
  );
};

export default AppRegister;
