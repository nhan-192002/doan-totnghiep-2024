import {
  SafeAreaView,
  ScrollView,
  Alert,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Container } from "../styles/FeedStyles";
import { auth, firebase, app, firebaseConfig } from "../../firebase";
import "firebase/firestore";
import styles from "./styles";
import PortCard from "./../HomePage/PortCard";
import AuthController from "../../controller/AuthController";
import UserController from "../../controller/UserController";
import { LinearGradient } from "expo-linear-gradient";
import darkModel from "../styles/DarkModel";

const UserPage = ({ navigation, route }) => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [follow, setFollow] = useState(null);
  const [numberfollow, setNumberFollow] = useState(null);

  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? darkModel.lightThemeText : darkModel.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? darkModel.lightContainer : darkModel.darkContainer;
  const themeIconStayle = colorScheme === 'light' ? '#242c40' : '#DDDDDD';

  const gradientColors = colorScheme === 'dark' 
    ? ['#434343', '#000000'] // Màu cho chế độ Dark
    : ['#EEEEEE', '#888888']; // Màu cho chế độ Light

  // lấy dữ liệu
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user?.uid);
      } else {
        setUserId(null);
      }
    });

    UserController.observeData(
      route.params ? route.params?.userId : auth.currentUser?.uid,
      (updatedData) => {
        setData(updatedData);
      }
    );

    UserController.getUserData(
      route.params ? route.params?.userId : auth.currentUser?.uid,
      (user) => {
        if (user) {
          setUserData(user);
        }
      }
    );
    UserController.dataFollow(
      auth.currentUser?.uid,
      route.params?.userId,
      setFollow,
      setNumberFollow
    );

    return () => unsubscribe();
  }, [navigation, loading]);

  //đăng xuất
  const logout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có muốn đăng xuất không?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Không đăng xuất!"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            AuthController.logout(
              () => {
                navigation.popToTop();
              },
              (error) => {
                console.log(error);
              }
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  //like bài viết
  const onLike = async (item) => {
    try {
      const updatedLikes = await UserController.toggleLike(
        item.id,
        auth.currentUser?.uid
      );
      console.log("Update like");
      console.log(updatedLikes.indexOf(auth.currentUser?.uid));
    } catch (error) {
      console.error("Update like error:", error);
    }
  };

  //cmt
  const onComment = (item) => {
    navigation.navigate("Comment", {
      postID: item.id,
      comments: item.comments,
    });
  };

  // xóa bài viết
  const onPostDelete = (postId) => {
    UserController.handleDelete(postId);
    navigation.navigate("Profile");
  };

  const handleAddToDeleteFollower = async () => {
    UserController.handleAddToDeleteFollower(
      auth.currentUser?.uid,
      route.params?.userId,
      setFollow
    );
  };

  // const handleRemoveFromFollower = async () => {
  //   try {
  //     const userRef = firebase.firestore().collection("NewUser").doc(auth.currentUser?.uid);

  //     // Lấy dữ liệu hiện tại từ cột "follow" trong tài liệu NewUser
  //     const userSnapshot = await userRef.get();
  //     if (userSnapshot.exists) {
  //       const userData = userSnapshot.data();
  //       const followData = userData.follow || [];

  //       // Kiểm tra xem người dùng đã theo dõi người này chưa
  //       if (followData.includes(route.params?.userId)) {
  //         // Nếu đã theo dõi, loại bỏ ID của người dùng khỏi mảng "follow"
  //         const updatedFollowData = followData.filter((id) => id !== route.params?.userId);

  //         // Cập nhật dữ liệu trong Firestore
  //         await userRef.update({ follow: updatedFollowData });

  //         console.log("Đã xóa khỏi danh sách theo dõi.");
  //         setFollow(null);
  //       } else {
  //         console.log("Người dùng chưa được theo dõi trước đó.");
  //       }
  //     } else {
  //       console.log("Không tìm thấy tài liệu người dùng.");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật dữ liệu: ", error);
  //   }
  // }

  return (
    // SafeAreaView
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
              }}
              showVerticalScrollIndicator={false}
            >
              <Image
                style={styles.userImg}
                source={{
                  uri: userData
                    ? userData.userImg ||
                      "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
                    : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
                }}
              />
              <Text style={[styles.userName,themeTextStyle]}>{userData ? userData.name : ""}</Text>
              <Text style={styles.aboutUser}>
                {userData ? userData.email : userId}
              </Text>
              <View style={styles.userBtnWrapper}>
                {route.params && route.params.userId != auth.currentUser?.uid ? (
                  <>
                    <TouchableOpacity
                      style={styles.userBtn}
                      onPress={() =>
                        navigation.navigate("Chat", {
                          userName: userData ? userData.name : "",
                          uid: route.params.userId,
                        })
                      }
                    >
                      <Text style={styles.userBtnTxt}>Tin nhắn</Text>
                    </TouchableOpacity>
                    {auth.currentUser?.email == 'admin@gmail.com' ? null : (
                      <>
                        {follow != null ? (
                          <TouchableOpacity
                            style={styles.userBtn}
                            onPress={handleAddToDeleteFollower}
                          >
                            <Text style={styles.userBtnTxt}>Hủy theo dõi</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.userBtn}
                            onPress={handleAddToDeleteFollower}
                          >
                            <Text style={styles.userBtnTxt}>Theo dõi</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.userBtn}
                      onPress={() => navigation.navigate("EditProfile")}
                    >
                      <Text style={styles.userBtnTxt}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.userBtn}
                      onPress={() => logout()}
                    >
                      <Text style={styles.userBtnTxt}>Đăng xuất</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <View style={styles.userInfoWrapper}>
                <View style={styles.userInfoItem}>
                  <Text style={[styles.userInfoTitle,themeTextStyle]}>{data.length}</Text>
                  <Text style={styles.userInfoSubTitle}>Bài viết</Text>
                </View>
                {/* <View style={styles.userInfoItem}>
                  <Text style={styles.userInfoTitle}>10,000</Text>
                  <Text style={styles.userInfoSubTitle}>Người theo dõi</Text>
                </View> */}
                <View style={styles.userInfoItem}>
                  <Text style={[styles.userInfoTitle,themeTextStyle]}>
                    {userData ? userData.follow.length : numberfollow}
                  </Text>
                  <Text style={styles.userInfoSubTitle}>Đang theo dõi</Text>
                </View>
              </View>

              {data.map((item) => (
                <PortCard
                  key={item.id}
                  item={item}
                  onLike={onLike}
                  onComment={onComment}
                  onDelete={() => onPostDelete(item.id)}
                />
              ))}
            </ScrollView>
        </LinearGradient>
      </Container>
    </SafeAreaView>
  );
};

export default UserPage;
