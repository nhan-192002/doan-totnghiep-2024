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

const MoreNews = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [TextNew, setTextNew] = useState("");
  const [userData, setUserData] = useState(null);

  const uploandfile = async () => {
    if (image?.uri != null) {
      setUploading(true);
      UserController.uploadImagePosts(image.uri, TextNew, auth.currentUser.uid)
        .then(() => {
          Keyboard.dismiss();
          setImage(null);
          setTextNew(null);
          setUploading(false);
          Alert.alert("Tải bài viết thành công");
          navigation.navigate("Trang chủ");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setUploading(true);
      UserController.uploadTextPosts(TextNew, auth.currentUser.uid)
        .then(() => {
          Keyboard.dismiss();
          setTextNew(null);
          setUploading(false);
          Alert.alert("Tải bài viết thành công");
          navigation.navigate("Home");
        })
        .catch((error) => {
          alert(error);
        });
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
    <View style={styles.viewlAll}>
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
            <Text style={styles.textUser1}>
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
              <Ionicons name="cloud-upload-outline" size={30} />
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
              style={styles.textInput}
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
                <Ionicons name="camera-outline" size={35} />
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
                <Ionicons name="image-outline" size={35} />
              </Interaction>
            </InteractionWrapper>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default MoreNews;
