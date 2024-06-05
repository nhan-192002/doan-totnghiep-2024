import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  VirtualizedList,
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
    return () => {
      UserController.loadingMessenger();
    };
  }, []);

  const [dataUserAI, setdataUserAI] = useState([]);

  const dataUser = () => {
    if (auth.currentUser?.uid) {
      const userDocRef = firebase.firestore().collection("NewUser").doc(auth.currentUser.uid);
      const unsubscribe = userDocRef.onSnapshot((doc) => {
        if (doc.exists) {
          setdataUserAI(doc.data());
        } else {
          console.log("No such document!");
        }
      });
  
      // Trả về hàm hủy đăng ký sự kiện
      return unsubscribe;
    } else {
      console.log("User not logged in or UID not available");
    }
  };
  

  useEffect(() => {
    dataUser();
    console.log(dataUserAI);
  }, []);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        height: "100%"
      }}
    >
      <Card
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
        onPress={() =>
          navigation.navigate("Gemini", {
            name: dataUserAI.name,
            image: dataUserAI.userImg,
          })
        }
      >
        <UserInfo>
          <UserImgWrapper>
            <UserImg source={require("./../../assets/icons/robot.png")} />
          </UserImgWrapper>
          <TextSection>
            <UserInfoText>
              <UserName>Gemini AI</UserName>
            </UserInfoText>
          </TextSection>
        </UserInfo>
      </Card>

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
