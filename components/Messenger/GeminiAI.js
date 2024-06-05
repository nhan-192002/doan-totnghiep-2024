import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-native-markdown-display";
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

const API_KEY = "AIzaSyBpw9CGHKik00yf5PDBzS6iSJsu2MJxaz8";
const genAI = new GoogleGenerativeAI(API_KEY);

export default function GeminiAi({ navigation, route }) {
  const [inputText, setInputText] = useState("");
  const [listData, setListData] = useState([]);

  const { name, image } = route.params;

  const SearchInput = () => {
    setListData((prevList) => [...prevList, inputText]);
    setInputText("");
  };

  const renderItem = ({ item }) => (
    <View>
      <Message message={item} />
      <Response prompt={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("./../../assets/icons/robot.png")}
          style={styles.icon}
        />
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#323232" }}>
          Gemini AI
        </Text>
      </View>

      {/* Content */}
      <FlatList
        style={{ paddingHorizontal: 16, marginBottom: 80 }}
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Search-Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Ask to Gemini AI"
          style={styles.input}
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          selectionColor={"#323232"}
        />
        <TouchableOpacity onPress={SearchInput}>
          <Image
            source={require("./../../assets/icons/right-arrow.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  function Response({ prompt }) {
    const [generatedText, setGeneratedText] = useState("");
    const date = new Date();

    useEffect(() => {
      const fetchData = async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        setGeneratedText(text);
      };
      fetchData();
    }, [prompt]);

    return (
      <View style={styles.response}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Image
              source={require("./../../assets/icons/robot.png")}
              style={styles.icon}
            />
            <Text style={{ fontWeight: 600 }}>Gemini</Text>
          </View>
          <Text style={{ fontSize: 10, fontWeight: "600" }}>
            {date.getHours()}:{date.getMinutes()}
          </Text>
        </View>
        <Markdown>{generatedText}</Markdown>
      </View>
    );
  }

  function Message({ message, route }) {
    const date = new Date();

    return (
      <View style={styles.message}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {image != "" ? (
              <UserImgWrapper>
                <UserImg source={{ uri: image ? image : null }} style={styles.icon} />
              </UserImgWrapper>
            ) : (
              <UserImgWrapper>
                <UserImg source={require("./../../assets/icons/user.png")} />
              </UserImgWrapper>
            )}
            <Text style={{ fontWeight: 500 }}>{name}</Text>
          </View>
          <Text style={{ fontSize: 10, fontWeight: 600 }}>
            {date.getHours()}:{date.getMinutes()}
          </Text>
        </View>
        <Text style={{ fontSize: 14, width: "100%", flex: 1, paddingLeft: 0 }}>
          {message}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingTop: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    margin: 8,
    gap: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
  searchBar: {
    backgroundColor: "#ffffff",
    width: "100%",
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 32,
    borderWidth: 0.1,
  },
  response: {
    flexDirection: "column",
    gap: 8,
    backgroundColor: "#fafafa",
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
  },
  message: {
    flexDirection: "column",
    gap: 8,
    backgroundColor: "#f1f2f3",
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
  },
  icon: {
    width: 28,
    height: 28,
  },
});
