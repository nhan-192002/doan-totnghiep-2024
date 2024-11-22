import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
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
  FlatList,
} from "../styles/FeedStyles";
import { auth, firebase, app, firebaseConfig } from "../../firebase";
import "firebase/firestore";
import moment from "moment/moment";
import UserController from "../../controller/UserController";
import darkModel from "../styles/DarkModel";

const PortCard = ({ item, onDelete, onPress, onComment, onLike }) => {
  const [userData, setUserData] = useState(null);
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? darkModel.lightThemeText : darkModel.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? darkModel.lightContainer : darkModel.darkContainer;

  const gradientColors = colorScheme === 'dark' 
    ? ['#434343', '#000000'] // Màu cho chế độ Dark
    : ['#EEEEEE', '#888888']; // Màu cho chế độ Light

  let status = false;
  let likeText = ""; 
  let commentsText = ""; 

  const Time = moment(item.time).fromNow();

  if (item.likes.length == 1) {
    likeText = "1 Thích";
  } else if (item.likes.length > 1) {
    likeText = item.likes.length + " Thích";
  } else {
    likeText = "Thích";
  }

  if (item.comments == 1) {
    commentsText = "1 Bình luận";
  } else if (item.likes > 1) {
    commentsText = item.likes + " Bình luận";
  } else {
    commentsText = "Bình luận";
  }

  const getLikeStatus = (likes) => {
    status = likes.includes(auth.currentUser?.uid);
    return status;
  };

  useEffect(() => {
    UserController.getUserDataCard(item?.user, setUserData);

    const unsubscribe = UserController.subscribeToUserData(
      item?.user,
      (updatedData) => {
        setUserData(updatedData);
      }
    );

    return () => {
      // Hủy đăng ký lắng nghe khi component unmount
      unsubscribe();
    };
  }, []);
  const report = (name, id) => {
    Alert.alert(
      "Báo cáo bài viết",
      `Bạn có muốn báo cáo bài viết của ${name}?`,
      [
        {
          text: "Không",
          onPress: () => console.log("Không báo cáo!"),
          style: "cancel",
        },
        {
          text: "Có",
          onPress: () => handleReport (id),
        },
      ],
      { cancelable: false }
    );
  };

  const handleReport = (id) => {
    const updateData = {
      report: firebase.firestore.FieldValue.increment(1),
    };

    // Thực hiện cập nhật dữ liệu trong Firestore
    firebase.firestore().collection("MoreNews").doc(id).update(updateData)
      .then(() => {
        console.log("Cập nhật dữ liệu thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật dữ liệu: ", error);
      });
    console.log(id + report);
  };

  return (
    <TouchableWithoutFeedback
      style={{
        position: "absolute",
        left: 0,
        padding: 20,
        backgroundColor: "green",
      }}
      // onLongPress={() => {
      //   // Nhấn giữ sau 1 giây
      //   backTimer = setTimeout(() => {
      //     report(userData?.name, item.id);
      //   }, 1000);
      // }}
    >
      {auth.currentUser?.email == "admin@gmail.com" && item.report != 0 ? (
        <Card style={{backgroundColor: '#EE3B3B'}} key={item.id}>
        <UserInfo>
          <UserImg
            source={{
              uri: userData
                ? userData.userImg ||
                  "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
                : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
            }}
          />
          <UserInfoText>
            <TouchableOpacity onPress={onPress}>
              <UserName>{userData ? userData.name || "" : ""}</UserName>
              <UserName>Đã có {item.report} lượt báo cáo bài viết này</UserName>
            </TouchableOpacity>

            <PostTime>{Time}</PostTime>
          </UserInfoText>
        </UserInfo>
        {item.text != "" ? <PostText>{item.text}</PostText> : ""}
        {item.image != "" ? (
          <PostImg source={{ uri: `${item.image}` }} />
        ) : (
          <Divider />
        )}
        <InteractionWrapper>
          {auth.currentUser?.email == "admin@gmail.com" ? (
            <>
              <Interaction>
                <Ionicons name="heart-outline" size={25} color="#333" />
                <InteractionText>{likeText}</InteractionText>
              </Interaction>
            </>
          ) : (
            <>
              {getLikeStatus(item.likes) ? (
                <>
                  <Interaction onPress={() => onLike(item)}>
                    <Ionicons name="heart" size={25} color="#2e64e5" />
                    <InteractionText>{likeText}</InteractionText>
                  </Interaction>
                </>
              ) : (
                <>
                  <Interaction onPress={() => onLike(item)}>
                    <Ionicons name="heart-outline" size={25} color="#333" />
                    <InteractionText>{likeText}</InteractionText>
                  </Interaction>
                </>
              )}
            </>
          )}
          <Interaction onPress={() => onComment(item)}>
            <Ionicons name="chatbox-outline" size={25} />
            <InteractionText>
              {item.comments.length > 0 ? item.comments.length : ""}{" "}
              {commentsText}
            </InteractionText>
          </Interaction>
          {auth.currentUser?.uid == item.user ||
          auth.currentUser?.email == "admin@gmail.com" ? (
            <Interaction onPress={() => onDelete(item.id)}>
              <Ionicons name="trash-outline" size={25} />
            </Interaction>
          ) : (null)}
        </InteractionWrapper>
      </Card>
      ):
      
      
      
      
      
      (
        <Card key={item.id} style={[themeContainerStyle]}>
        <UserInfo>
          <UserImg
            source={{
              uri: userData
                ? userData.userImg ||
                  "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
                : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
            }}
          />
          <UserInfoText>
            <TouchableOpacity onPress={onPress}>
              <UserName style={[themeTextStyle]}>{userData ? userData.name || "" : ""}</UserName>
            </TouchableOpacity>

            <PostTime>{Time}</PostTime>
          </UserInfoText>
        </UserInfo>
        {item.text != "" ? <PostText style={[themeTextStyle]}>{item.text}</PostText> : ""}
        {item.image != "" ? (
          <TouchableOpacity onPress={() => onComment(item)}>
            <PostImg source={{ uri: `${item.image}` }} />
          </TouchableOpacity>
        ) : (
          <Divider />
        )}
        <InteractionWrapper>
          {auth.currentUser?.email == "admin@gmail.com" ? (
            <>
              <Interaction>
                <Ionicons name="heart-outline" size={25} color="#333" />
                <InteractionText>{likeText}</InteractionText>
              </Interaction>
            </>
          ) : (
            <>
              {getLikeStatus(item.likes) ? (
                <>
                  <Interaction onPress={() => onLike(item)}>
                    <Ionicons name="heart" size={25} color="#2e64e5" />
                    <InteractionText style={[themeTextStyle]}>{likeText}</InteractionText>
                  </Interaction>
                </>
              ) : (
                <>
                  <Interaction onPress={() => onLike(item)}>
                    <Ionicons name="heart-outline" size={25} color={(colorScheme === 'light'?'#242c40':'#DDDDDD')} />
                    <InteractionText style={[themeTextStyle]}>{likeText}</InteractionText>
                  </Interaction>
                </>
              )}
            </>
          )}
          <Interaction onPress={() => onComment(item)}>
            <Ionicons name="chatbox-outline" size={25} color={(colorScheme === 'light'?'#242c40':'#DDDDDD')} />
            <InteractionText style={[themeTextStyle]}>
              {item.comments.length > 0 ? item.comments.length : ""}{" "}
              {commentsText}
            </InteractionText>
          </Interaction>
          {auth.currentUser?.uid == item.user ||
          auth.currentUser?.email == "admin@gmail.com" ? (
            <Interaction onPress={() => onDelete(item.id)}>
              <Ionicons name="trash-outline" size={25} color={(colorScheme === 'light'?'#242c40':'#DDDDDD')}/>
            </Interaction>
          ) : (   <Interaction onPress={() => report(userData?.name, item.id)}>
              <Ionicons name="alert-circle-outline" size={25} color={(colorScheme === 'light'?'#242c40':'#DDDDDD')}/>
            </Interaction>)}
        </InteractionWrapper>
      </Card>
      )}
    </TouchableWithoutFeedback>
  );
};

export default PortCard;
