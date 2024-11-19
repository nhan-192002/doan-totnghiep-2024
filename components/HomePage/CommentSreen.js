import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import {
  Interaction,
  InteractionWrapper,
} from "../styles/FeedStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import PortCard from "./PortCard";
import PortComment from "./PortComment";
import "firebase/firestore";
import { auth, firebase, app, firebaseConfig } from "../../firebase";

import UserController from "../../controller/UserController";
const db = firebase.firestore();

const CommentSreen = ({ route, navigation }) => {
  const { postID } = route.params;
  const { comments } = route.params;
  const [comment, setComment] = useState("");

  //tải cmt lên firebase
  const postComment = () => {
    UserController.postComment(postID, comment, auth.currentUser.uid)
      .then((result) => {
        console.log(result);
        setComment("");
      })
      .catch((error) => {
        console.log("Lỗi khi tải lên bình luận: ", error);
      });
  };

  //xóa bài viết
  const handleDelete = (postId) => {
    Alert.alert(
      "Xoá bài",
      "Bạn có muốn xoá bài không?",
      [
        {
          text: "Không",
          onPress: () => console.log("Không xoá!"),
          style: "cancel",
        },
        {
          text: "Có",
          onPress: () => {
            UserController.deletePost(postId);
            navigation.navigate("Trang chủ");
          },
        },
      ],
      { cancelable: false }
    );
  };

  //like
  const onLike = async (item) => {
    try {
      UserController.toggleLike(item.id, auth.currentUser.uid);
    } catch (error) {
      console.error("Update like error:", error);
    }
  };

  const [data, setData] = useState([]);
  //tải dữ liệu bài viết cmt
  useEffect(() => {
    UserController.fetchPostData(postID, setData);
  }, [postID]);

  const [connectedData, setConnectedData] = useState([]);

  //Tải dữ liệu cmt
  useEffect(() => {
    UserController.fetchPostDataCMT(postID, setConnectedData);

    return () => {
      UserController.unsubscribeFromConnectedData();
    };
  }, [postID]);

  // xóa cmt
  const deleteCommentByIndex = (index) => {
    Alert.alert("Xóa bình luận", "Bạn có muốn xóa bình luận?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            const result = await UserController.deleteCommentByIndex(
              postID,
              index
            );
            console.log(result);
          } catch (error) {
            console.log("Lỗi khi xóa bình luận: ", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        <View style={{ flex: 1 }}>
          {data.map((item) => (
            <PortComment
              key={item.id}
              item={item}
              onLike={onLike}
              onDelete={handleDelete}
              onPress={() =>
                navigation.navigate("HomeProfile", { userId: item.user })
              }
            />
          ))}
        </View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {connectedData.map((item, index) => (
            <View key={index}>
              <Card>
                <UserInfo>
                  <UserImgWrapper>
                    <UserImg
                      source={{
                        uri: item
                          ? item.userImg ||
                            "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
                          : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
                      }}
                    />
                  </UserImgWrapper>
                  <TextSection>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("HomeProfile", {
                              userId: item.uid,
                            })
                          }
                        >
                          <UserInfoText>
                            <UserName>{item.name}</UserName>
                          </UserInfoText>
                        </TouchableOpacity>

                        <MessageText>{item.comment}</MessageText>
                      </View>
                      {auth.currentUser.uid == item.uid || auth.currentUser?.email == 'admin@gmail.com' ? (
                        <UserImgWrapper>
                          <TouchableOpacity
                            onPress={() => deleteCommentByIndex(index)}
                          >
                            <MessageText>Xóa bình luận</MessageText>
                          </TouchableOpacity>
                        </UserImgWrapper>
                      ) : (
                        <UserImgWrapper></UserImgWrapper>
                      )}
                    </View>
                  </TextSection>
                </UserInfo>
              </Card>
            </View>
          ))}
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        behavior="padding" // Hoặc "height", tùy thuộc vào hành vi bạn muốn
        keyboardVerticalOffset={85}
      >
        <View
          style={{
            // width: "100%",
            // height: 100,
            // position: "absolute",
            // bottom: 0,
            flexDirection: "row",
            // backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <TextInput
            value={comment}
            onChangeText={(txt) => {
              setComment(txt);
            }}
            style={{
              width: 300,
              // backgroundColor: '#fff',
              // borderWidth: 1,
              borderRadius: 5,
              // borderTopLeftRadius: 30,
              // borderBottomLeftRadius: 30,
              borderColor: "#fff",
              borderColor: "black",
              paddingHorizontal: 20,
              paddingVertical: 10,
              fontSize: 16,
              textAlign: "left",
              height: 50,
              borderWidth: 1,
              borderRadius: 100,
            }}
            placeholder="Viết bình luận công khai..."
          />
          {/* <Text
            style={{ marginRight: 10, fontSize: 20, fontWeight: "600" }}
            onPress={() => postComment()}
          >
            Gửi
          </Text> */}
          <InteractionWrapper>
            <Interaction onPress={postComment}>
              <Ionicons name="send-outline" size={30} />
            </Interaction>
          </InteractionWrapper>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CommentSreen;
