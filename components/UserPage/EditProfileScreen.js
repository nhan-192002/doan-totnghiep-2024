import {
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FormButton from "./FormButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
// import { AuthContext } from '../navigation/AuthProvider';
import { auth, firebase } from "../../firebase";
import { DocumentSnapshot } from "firebase/firestore";
import UserController from "../../controller/UserController";
import { LinearGradient } from "expo-linear-gradient";
import darkModel from "../styles/DarkModel";

const EditProfileScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [Uri, setUri] = useState(null);
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);

  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? darkModel.lightThemeText : darkModel.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? darkModel.lightContainer : darkModel.darkContainer;
  const themeIconStayle = colorScheme === 'light' ? '#242c40' : '#DDDDDD';

  const gradientColors = colorScheme === 'dark' 
    ? ['#434343', '#000000'] // Màu cho chế độ Dark
    : ['#EEEEEE', '#888888']; // Màu cho chế độ Light

  useEffect(() => {
    UserController.getUserDataProfile(auth.currentUser.uid)
      .then((data) => setUserData(data))
      .catch((error) => console.error(error));
  }, []);

  const handleUpdate = async () => {
    if (Uri != null) {
      setUploading(true);
      UserController.uploadImage(Uri.uri)
        .then((url) => {
          if (url == null && userData.userImg) {
            url = userData.userImg;
          }

          const timestamp = firebase.firestore.FieldValue.serverTimestamp();
          console.log("imageURL: ", url);
          const updatedData = {
            time: timestamp,
            name: userData.name,
            userImg: url,
            about: userData.about,
            phone: userData.phone,
            country: userData.country,
            city: userData.city,
            uid: auth.currentUser.uid,
          };
          UserController.updateUserData(auth.currentUser.uid, updatedData)
            .then(() => {
              Alert.alert("Đã chỉnh sửa hoàn tất");
              Keyboard.dismiss();
            })
            .catch((error) => {
              alert(error);
            });
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const updatedData = {
        time: timestamp,
        name: userData.name,
        about: userData.about,
        phone: userData.phone,
        country: userData.country,
        city: userData.city,
        uid: auth.currentUser.uid,
      };
      UserController.updateUserData(auth.currentUser.uid, updatedData)
        .then(() => {
          Alert.alert("Đã chỉnh sửa hoàn tất");
          Keyboard.dismiss();
        })
        .catch((error) => {
          alert(error);
        });
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const takeImg = () => {
    Alert.alert(
      "Đăng ảnh đại diện",
      "Chọn ảnh của bạn",
      [
        {
          text: "Chọn ảnh từ thư viện",
          onPress: () => pickImage(),
          style: "cancel",
        },
        {
          text: "Chụp ảnh",
          onPress: () => openCamera(),
        },
        {
          text: "Huỷ",
          onPress: () => console.log("Huỷ chọn ảnh"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const scoure = { uri: result.assets[0].uri };
      setUri(scoure);
      console.log(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        const scoure = { uri: result.assets[0].uri };
        setUri(scoure);
        console.log(result.assets[0].uri);
        setImage(result.assets[0].uri);
      } else {
        console.log("Bạn chưa cho phép truy cập camera");
      }
    }
  };
  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <View style={{ margin: 20 }}>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={() => takeImg()}>
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ImageBackground
                source={{
                  uri: image
                    ? image
                    : userData
                    ? userData.userImg ||
                      "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
                    : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
                }}
                style={{ height: 100, width: 100 }}
                imageStyle={{ borderRadius: 15 }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    size={35}
                    color="#fff"
                    style={{
                      opacity: 0.7,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "#fff",
                      borderRadius: 10,
                    }}
                  />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>

          <Text style={[{ marginTop: 10, fontSize: 18, fontWeight: "bold" },themeTextStyle]}>
            {userData ? userData.name : ""}
          </Text>
          <Text style={themeTextStyle}>{auth.currentUser.uid}</Text>
        </View>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={themeIconStayle} size={20} />
          <TextInput
            placeholder="Tên người dùng"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.name : ""}
            onChangeText={(txt) => setUserData({ ...userData, name: txt })}
            style={[styles.textInput,themeTextStyle]}
          />
        </View>
        <View style={styles.action}>
          <Ionicons name="clipboard-outline" color={themeIconStayle} size={20} />
          <TextInput
            placeholder="Giới thiệu"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.about : ""}
            onChangeText={(txt) => setUserData({ ...userData, about: txt })}
            style={[styles.textInput,themeTextStyle]}
          />
        </View>
        <View style={styles.action}>
          <Feather name="phone" color={themeIconStayle} size={20} />
          <TextInput
            placeholder="Số điện thoại"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.phone : ""}
            onChangeText={(txt) => setUserData({ ...userData, phone: txt })}
            style={[styles.textInput,themeTextStyle]}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="globe" color={themeIconStayle} size={20} />
          <TextInput
            placeholder="Đất nước"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.country : ""}
            onChangeText={(txt) => setUserData({ ...userData, country: txt })}
            style={[styles.textInput,themeTextStyle]}
          />
        </View>
        <View style={styles.action}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            color={themeIconStayle}
            size={20}
          />
          <TextInput
            placeholder="Thành phố"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.city : ""}
            onChangeText={(txt) => setUserData({ ...userData, city: txt })}
            style={[styles.textInput,themeTextStyle]}
          />
        </View>
        <FormButton buttonTitle="Update" onPress={handleUpdate} />
      </View>
    </LinearGradient>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    width: "100%",
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#2e64e5",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: 0, // Hoặc một giá trị phù hợp khác
    paddingLeft: 10,
    color: "#333333",
  }

});
