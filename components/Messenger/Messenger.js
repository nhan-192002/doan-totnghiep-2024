import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
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
import { auth, firebase } from "../../firebase";
import UserController from "../../controller/UserController";

const Messenger = ({ navigation }) => {
  const db = firebase.firestore();
  const [data, setData] = useState([]);

  useEffect(() => {
    UserController.dataMessenger(auth.currentUser.uid, (updatedData) => {
      setData(updatedData);
    });
    return () =>{
      UserController.loadingMessenger();
    }
  }, []);

  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            onPress={() =>
              navigation.navigate("Chat", {
                userName: item.name,
                uid: item.uid,
              })
            }
          >
            <UserInfo>
              <UserImgWrapper>
                <UserImg
                  source={{
                    uri: data
                      ? item.userImg ||
                        "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
                      : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
                  }}
                />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("HomeProfile", { userId: item.uid })
                    }
                  >
                    <UserName>{item.name}</UserName>
                  </TouchableOpacity>
                </UserInfoText>
                <MessageText>{item.email}</MessageText>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />
    </View>
  );
};

export default Messenger;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
