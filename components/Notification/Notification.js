import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TextInput,
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

const Notification = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [findName, setFindName] = useState(null);

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
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(Findname) => setFindName(Findname)}
          style={styles.input}
          numberOfLines={1}
          placeholder="Nhập tên cần tìm"
          placeholderTextColor="#666"
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
                  <UserName>{item.name}</UserName>
                </UserInfoText>
              </TextSection>
            </UserInfo>
          </Card>
        )}
      />
    </View>
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
    color: "#333",
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
