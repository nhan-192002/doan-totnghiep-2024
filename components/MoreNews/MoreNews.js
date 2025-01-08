import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Keyboard,
  useColorScheme,
} from "react-native";
import {
  Card,
  Container,
  Divider,
  Interaction,
  InteractionText,
  InteractionWrapper,
  PostImg,
  PostText,
  PostTime,
  UserImg,
  UserInfo,
  UserInfoText,
  UserName,
} from "../styles/FeedStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import * as ImagePicker from "expo-image-picker";
// import { getStorage, ref } from "firebase/storage";
import { auth, firebase } from "./../../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import "firebase/firestore";
import UserController from "../../controller/UserController";
import darkModel from "../styles/DarkModel";
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { SERVER_IMAGE, SERVER_IP, SERVER_PORT } from "../../config";

const MoreNews = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [TextNew, setTextNew] = useState("");
  const [userData, setUserData] = useState(null);
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? darkModel.lightThemeText : darkModel.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? darkModel.lightContainer : darkModel.darkContainer;
  const themeIconStayle = colorScheme === 'light' ? '#242c40' : '#DDDDDD';

  const gradientColors = colorScheme === 'dark' 
    ? ['#434343', '#000000'] // Màu cho chế độ Dark
    : ['#EEEEEE', '#888888']; // Màu cho chế độ Light

  // const uploandfile = async () => {
  //   if (image?.uri != null) {
  //     setUploading(true);
  //     UserController.uploadImagePosts(image.uri, TextNew, auth.currentUser.uid)
  //       .then(() => {
  //         Keyboard.dismiss();
  //         setImage(null);
  //         setTextNew(null);
  //         setUploading(false);
  //         Alert.alert("Tải bài viết thành công");
  //         navigation.navigate("Trang chủ");
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //     setUploading(true);
  //     UserController.uploadTextPosts(TextNew, auth.currentUser.uid)
  //       .then(() => {
  //         Keyboard.dismiss();
  //         setTextNew(null);
  //         setUploading(false);
  //         Alert.alert("Tải bài viết thành công");
  //         navigation.navigate("Home");
  //       })
  //       .catch((error) => {
  //         alert(error);
  //       });
  //   }
  // };

const uploandfile = async () => {
    if (image?.uri != null) {
      setUploading(true);

      const formData = new FormData();
      formData.append('image', {
        uri: image.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      try {
        // Gửi ảnh qua API server Python để gắn tag
        const response = await axios.post(`http://${SERVER_IP}:${SERVER_IMAGE}/process-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });        

        const { all_tags, filtered_tags } = response.data;
        console.log("All tags:", all_tags);
        console.log("Filtered tags:", filtered_tags);

        // Tiếp tục gọi API backend để lưu bài viết
        await UserController.uploadImagePosts(image.uri, TextNew, auth.currentUser.uid, filtered_tags);

        Keyboard.dismiss();
        setImage(null);
        setTextNew(null);
        setUploading(false);
        Alert.alert("Tải bài viết thành công");
        navigation.navigate("Trang chủ");
      } catch (error) {
        console.log(error);
        Alert.alert("Lỗi", "Không thể xử lý ảnh hoặc tải bài viết.");
        setUploading(false);
      }
    } else {
      // Xử lý bài viết không có ảnh
      try {
        await UserController.uploadTextPosts(TextNew, auth.currentUser.uid);
        Keyboard.dismiss();
        setTextNew(null);
        setUploading(false);
        Alert.alert("Tải bài viết thành công");
        navigation.navigate("Trang chủ");
      } catch (error) {
        console.log(error);
        Alert.alert("Lỗi", "Không thể tải bài viết.");
        setUploading(false);
      }
    }
  };


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const scoure = { uri: result.assets[0].uri };
      console.log(scoure);
      setImage(scoure);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        // Ảnh đã được chụp, xử lý tại đây
        const scoure = { uri: result.assets[0].uri };
        console.log(scoure);
        setImage(scoure);
      }
    } else {
      // Không có quyền truy cập camera
      console.log("Bạn chưa cho phép truy cập camera");
    }
  };
  const deleteImg = () => {
    setImage("");
  };

  useEffect(() => {
    const userId = auth.currentUser.uid; // Thay thế bằng userId của người dùng cụ thể
    UserController.getUserDataCard(userId, setUserData);

    const unsubscribe = UserController.subscribeToUserData(
      userId,
      (updatedData) => {
        setUserData(updatedData);
      }
    );

    return () => {
      // Hủy đăng ký lắng nghe khi component unmount
      unsubscribe();
    };
  }, []);

  return (
    <LinearGradient colors={gradientColors} style={styles.viewlAll}>
      <View style={styles.viewScol}>
        <View style={styles.imgUser}>
          <View
            style={{
              width: "70%",
              height: 50,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Image
              style={styles.imgUser1}
              source={{
                uri: userData
                  ? userData.userImg ||
                    "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
                  : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
              }}
            />
            <Text style={[styles.textUser1,themeTextStyle]}>
              {userData ? userData.name : ""}
            </Text>
          </View>

          {/* <TouchableOpacity onPress={uploandfile}>
            <Image
              source={require("../../img/upload.png")}
              style={styles.imgback1}
            />
          </TouchableOpacity> */}
          {uploading ?(<Text>đang tải bài viết...</Text>):(<InteractionWrapper>
            <Interaction onPress={uploandfile}>
              <Ionicons name="cloud-upload-outline" size={30} color={themeIconStayle}/>
            </Interaction>
          </InteractionWrapper>)}
        </View>
        <ScrollView>
          <View style={styles.text}>
            <TextInput
              value={TextNew}
              onChangeText={(text) => setTextNew(text)}
              placeholder={"Bạn đang nghĩ gì?"}
              editable
              multiline
              numberOfLines={4}
              style={[styles.textInput,themeTextStyle]}
            />
          </View>
          {image && (
            <View style={styles.imgupdate}>
              <Image source={{ uri: image.uri }} style={styles.imgupdate} />
              <TouchableOpacity onPress={deleteImg}>
                <Ionicons
                  style={styles.closeImg}
                  name="close-circle-outline"
                  size={30}
                  color={themeIconStayle}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.allMenuButtom}>
            {/* <TouchableOpacity onPress={openCamera}>
              <View style={styles.menuBottom}>
                <Image
                  style={styles.uploadImg}
                  source={require("../../img/addCamera.png")}
                />
              </View>
            </TouchableOpacity> */}
            <InteractionWrapper>
              <Interaction onPress={openCamera}>
                <Ionicons name="camera-outline" size={35} color={themeIconStayle}/>
              </Interaction>
            </InteractionWrapper>
            {/* <TouchableOpacity onPress={pickImage}>
              <View style={styles.menuBottom}>
                <Image
                  style={styles.uploadImg1}
                  source={require("../../img/uploadImg.png")}
                />
              </View>
            </TouchableOpacity> */}
            <InteractionWrapper>
              <Interaction onPress={pickImage}>
                <Ionicons name="image-outline" size={35} color={themeIconStayle}/>
              </Interaction>
            </InteractionWrapper>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default MoreNews;
