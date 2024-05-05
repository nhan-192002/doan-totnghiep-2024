import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
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

const PortComment = ({ navigation, item, onDelete, onPress, onComment, onLike }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  let status = false;

  Time = moment(item.postTime).fromNow();

  useEffect(() => {
    UserController.getUserData(item.user, (user) => {
      if (user) {
        setUserData(user);
      }
    });
  }, [navigation, loading]);


  return (
    <Card key={item.id}>
      <UserInfo>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
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
              </TouchableOpacity>

              <PostTime>{Time}</PostTime>
            </UserInfoText>
          </View>
          <View>
            <InteractionWrapper>
              {auth.currentUser.uid == item.user ? (
                <Interaction onPress={() => onDelete(item.id)}>
                  <Ionicons name="trash-outline" size={25} />
                </Interaction>
              ) : null}
            </InteractionWrapper>
          </View>
        </View>
      </UserInfo>
      {item.text != "" ?(
        <PostText>{item.text}</PostText>
      ):(
        ''
      )}
      {item.image != "" ? (
        <PostImg source={{ uri: `${item.image}` }} />
      ) : (
        <Divider />
      )}
    </Card>
  );
};

export default PortComment;
