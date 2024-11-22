import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TextInput,
  useColorScheme,
} from "react-native";
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from "../styles/MessageStyles";
import FormInput from "./FormInput";
import Ionicons from "react-native-vector-icons/Ionicons";
import { windowHeight, windowWidth } from "../utils/Dimentions";
import { TouchableOpacity } from "react-native";
import UserController from "../../controller/UserController";
import { auth, firebase, app, firebaseConfig } from "../../firebase";

import axios from "axios";
import darkModel from "../styles/DarkModel";
import { LinearGradient } from 'expo-linear-gradient';

const Notification = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [findName, setFindName] = useState(null);

  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? darkModel.lightThemeText : darkModel.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? darkModel.lightContainer : darkModel.darkContainer;

  const gradientColors = colorScheme === 'dark' 
    ? ['#434343', '#000000'] // Màu cho chế độ Dark
    : ['#EEEEEE', '#888888']; // Màu cho chế độ Light

  useEffect(() => {
    fetchData();
    console.log(suggestedUsers);
  }, []);

  useEffect(() => {
    if (suggestedUsers.length > 0) {
      fetchUserDetails(suggestedUsers);
    }
    console.log(userDetails);
  }, [suggestedUsers]);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://10.0.0.1:8083/get_recommend_user_uid",
        {
          uid: auth.currentUser?.uid,
        }
      );
      setSuggestedUsers(response.data.suggested_users);
    } catch (error) {
      console.error(error);
    }
  };

  // const fetchUserDetails = async (userIds) => {
  //   try {
  //     // Lấy uid của người dùng hiện tại
  //     const currentUserUid = firebase.auth().currentUser.uid;

  //     // Lọc bỏ uid của người dùng hiện tại ra khỏi danh sách userIds
  //     const filteredUserIds = userIds.filter(
  //       (userId) => userId !== currentUserUid
  //     );

  //     // Truy vấn cơ sở dữ liệu Firebase để lấy tài liệu của người dùng hiện tại
  //     const userDocRef = firebase
  //       .firestore()
  //       .collection("NewUser")
  //       .doc(currentUserUid);
  //     const userDocSnapshot = await userDocRef.get();

  //     if (userDocSnapshot.exists) {
  //       const userData = userDocSnapshot.data();

  //       // Lấy danh sách các id của người dùng mà người dùng hiện tại đang theo dõi từ trường "follow" của tài liệu người dùng
  //       const followedUserIds = userData.follow || [];

  //       // Lọc danh sách userIds để chỉ chứa những id chưa được người dùng theo dõi
  //       const filteredUserIds = userIds.filter(
  //         (userId) => !followedUserIds.includes(userId)
  //       );

  //       // Lấy thông tin chi tiết của các người dùng chưa được theo dõi
  //       const userDetailsArray = await Promise.all(
  //         filteredUserIds.map(async (userId) => {
  //           const userDocRef = firebase
  //             .firestore()
  //             .collection("NewUser")
  //             .doc(userId);
  //           const userDocSnapshot = await userDocRef.get();
  //           if (userDocSnapshot.exists) {
  //             const userData = userDocSnapshot.data();
  //             return {
  //               id: userId,
  //               name: userData.name,
  //               email: userData.email,
  //               userImg: userData.userImg,
  //             };
  //           } else {
  //             console.log("No such document for user:", userId);
  //             return null;
  //           }
  //         })
  //       );

  //       // Lọc bỏ các giá trị null ra khỏi mảng chi tiết người dùng
  //       const filteredUserDetails = userDetailsArray.filter(
  //         (user) => user !== null
  //       );
  //       setUserDetails(filteredUserDetails);
  //     } else {
  //       console.log("No user document found for current user.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //   }
  // };

  const fetchUserDetails = async (userIds) => {
    try {
      // Lấy uid của người dùng hiện tại
      const currentUserUid = firebase.auth().currentUser.uid;

      // Lọc bỏ uid của người dùng hiện tại ra khỏi danh sách userIds
      const filteredUserIds = userIds.filter(
        (userId) => userId !== currentUserUid
      );

      // Truy vấn cơ sở dữ liệu Firebase để lấy tài liệu của người dùng hiện tại
      const userDocRef = firebase
        .firestore()
        .collection("NewUser")
        .doc(currentUserUid);
      const userDocSnapshot = await userDocRef.get();

      if (userDocSnapshot.exists) {
        const userData = userDocSnapshot.data();

        // Lấy danh sách các id của người dùng mà người dùng hiện tại đang theo dõi từ trường "follow" của tài liệu người dùng
        const followedUserIds = userData.follow || [];

        // Lọc danh sách userIds để chỉ chứa những id chưa được người dùng theo dõi
        const filteredUserIds = userIds.filter(
          (userId) => !followedUserIds.includes(userId)
        );

        // Lấy thông tin chi tiết của các người dùng chưa được theo dõi
        const userDetailsArray = await Promise.all(
          filteredUserIds.map(async (userId) => {
            const userDocRef = firebase
              .firestore()
              .collection("NewUser")
              .doc(userId);
            const userDocSnapshot = await userDocRef.get();
            if (userDocSnapshot.exists) {
              const userData = userDocSnapshot.data();
              return {
                id: userId,
                name: userData.name,
                email: userData.email,
                userImg: userData.userImg,
              };
            } else {
              console.log("No such document for user:", userId);
              return null;
            }
          })
        );

        // Lọc bỏ các giá trị null ra khỏi mảng chi tiết người dùng
        const filteredUserDetails = userDetailsArray.filter(
          (user) => user !== null && user.id !== currentUserUid // Loại bỏ người dùng đang đăng nhập
        );
        setUserDetails(filteredUserDetails);
      } else {
        console.log("No user document found for current user.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    // Lắng nghe sự thay đổi trong cột follow của người dùng
    const unsubscribe = firebase
      .firestore()
      .collection("NewUser")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        fetchData();
        fetchUserDetails(suggestedUsers);
      });

    // Hủy đăng ký lắng nghe khi component bị hủy
    return () => unsubscribe();
  }, []);

  const findUser = () => {
    UserController.findUserByName(findName)
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.error("Error finding user by name:", error);
      });
  };

  return (
    <LinearGradient
    colors={gradientColors}
      style={[{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      },themeContainerStyle]}
    >
      <View style={[styles.inputContainer,themeContainerStyle]}>
        <TextInput
          onChangeText={(Findname) => setFindName(Findname)}
          style={[styles.input,{color:(colorScheme === 'light'?'#242c40':'#DDDDDD')}]}
          numberOfLines={1}
          placeholder="Nhập tên cần tìm"
          placeholderTextColor={themeTextStyle}
        />
        <TouchableOpacity
          style={styles.iconStyle}
          onPress={() => findUser(findName)}
        >
          <Ionicons name="search-outline" color="#666" size={25} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Card
            onPress={() =>
              navigation.navigate("HomeProfile", { userId: item.id })
            }
          >
            <UserInfo>
              <UserImgWrapper>
                <UserImg
                  source={{
                    uri: item.userImg
                      ? item.userImg
                      : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
                  }}
                />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName style={themeTextStyle}>{item.name}</UserName>
                </UserInfoText>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />
      
      <Text style={themeTextStyle}>Những người bạn có thể biết</Text>
      <FlatList
        data={userDetails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Card
            onPress={() =>
              navigation.navigate("HomeProfile", { userId: item.id })
            }
          >
            <UserInfo>
              <UserImgWrapper>
                <UserImg
                  source={{
                    uri: item.userImg
                      ? item.userImg
                      : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
                  }}
                />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.name}</UserName>
                </UserInfoText>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />
    </LinearGradient>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: "100%",
    height: windowHeight / 15,
    borderColor: "#ccc",
    borderRadius: 100,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  iconStyle: {
    padding: 10,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRightColor: "#ccc",
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});
