import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  useColorScheme,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-native-markdown-display";
import darkModel from "../styles/DarkModel";

// API Key cho Google Generative AI
const API_KEY = "AIzaSyBrY0ziPKeowdOm1rXcVKo29CN6b4hA2KU";
const genAI = new GoogleGenerativeAI(API_KEY);

export default function GeminiAi({ route }) {
  const [inputText, setInputText] = useState("");
  const [listData, setListData] = useState([]);

  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? darkModel.lightThemeText : darkModel.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? '#DDDDDD' : '#222222';
  const themeIconStayle = colorScheme === 'light' ? '#242c40' : '#DDDDDD';

  const { name, image } = route.params;

  const handleInputSubmit = () => {
    if (inputText.trim() !== "") {
      setListData((prevList) => [...prevList, inputText]);
      setInputText("");
    }
  };

  const renderItem = ({ item }) => (
    <View>
      <Message message={item} name={name} image={image} />
      <Response prompt={item} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={[{ backgroundColor: themeContainerStyle },styles.container]}>
        <StatusBar style="auto" />

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("./../../assets/icons/robot.png")}
            style={styles.icon}
          />
          <Text style={[styles.headerText,{color: themeIconStayle}]}>ChatBot AI</Text>
        </View>

        {/* Content */}
        <FlatList
          style={{ paddingHorizontal: 16 }}
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="handled"
        />

        {/* Input Bar */}
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Ask ChatBot AI..."
            style={[styles.input,{color: themeIconStayle}]}
            value={inputText}
            onChangeText={(text) => setInputText(text)}
            onSubmitEditing={handleInputSubmit}
            selectionColor={"#323232"}
          />
          <TouchableOpacity onPress={handleInputSubmit}>
            <Image
              source={require("./../../assets/icons/right-arrow.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Response({ prompt }) {
  const [generatedText, setGeneratedText] = useState("");
  const date = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        setGeneratedText(text);
      } catch (error) {
        console.error("Error generating content:", error);
      }
    };
    fetchData();
  }, [prompt]);

  return (
    <View style={styles.response}>
      <View style={styles.responseHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image
            source={require("./../../assets/icons/robot.png")}
            style={styles.icon}
          />
          <Text style={{ fontWeight: "600" }}>ChatBot</Text>
        </View>
        <Text style={{ fontSize: 10, fontWeight: "600" }}>
          {date.getHours()}:{date.getMinutes()}
        </Text>
      </View>
      <Markdown>{generatedText || "Đang tạo phản hồi..."}</Markdown>
    </View>
  );
}

function Message({ message, name, image }) {
  const date = new Date();

  return (
    <View style={styles.message}>
      <View style={styles.messageHeader}>
        <Text style={styles.messageTime}>
          {date.getHours()}:{date.getMinutes()}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontWeight: "500" }}>{name}</Text>
          <Image
            source={image ? { uri: image } : require("./../../assets/icons/user.png")}
            style={styles.icon}
          />
        </View>
      </View>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 36,
    // backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#323232",
  },
  icon: {
    width: 32,
    height: 32,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    // backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    // backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  response: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  responseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  message: {
    backgroundColor: "#e8e8e8",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 10,
    fontWeight: "600",
  },
  messageText: {
    alignSelf: "flex-end",
    textAlign: "right", 
    fontSize: 14,
    padding: 8,
    backgroundColor: "#e1f5fe", 
    borderRadius: 12,
    maxWidth: "80%",
  },
});
