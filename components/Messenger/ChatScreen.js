import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text, Button, StyleSheet, useColorScheme, KeyboardAvoidingView, Platform } from "react-native";
import { Bubble, GiftedChat, Send, InputToolbar  } from "react-native-gifted-chat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { auth, firebase } from "../../firebase";
import darkModel from "../styles/DarkModel";
import { LinearGradient } from "expo-linear-gradient";

const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const { uid } = route.params;
  const chatRef = firebase.firestore().collection("chats");
  const db = firebase.firestore();
  const [userData, setUserData] = useState(null);

  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? darkModel.lightThemeText : darkModel.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? '#DDDDDD' : '#222222';
  const themeIconStayle = colorScheme === 'light' ? '#242c40' : '#DDDDDD';

  const gradientColors = colorScheme === 'dark' 
    ? ['#434343', '#000000'] // Màu cho chế độ Dark
    : ['#EEEEEE', '#888888']; // Màu cho chế độ Light

  // useEffect(() => {
  //   navigation.getParent().setOptions({ tabBarStyle: { display: "none" } });
  //   return () => {
  //     navigation.getParent().setOptions({ tabBarStyle: { display: "flex" } });
  //   };
  // }, []);


  useEffect(() => {
    // Ẩn thanh bottom navigation
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      // Hiển thị lại thanh bottom navigation và khôi phục màu
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: "flex",
          backgroundColor: colorScheme === "light" ? "#EEEEEE" : "#000000", // Đặt lại màu theo chế độ
        },
      });
    };
  }, [navigation, colorScheme]);

  const getAllMessages = async () => {
    const docid =
      uid > auth.currentUser.uid
        ? auth.currentUser.uid + "-" + uid
        : uid + "-" + auth.currentUser.uid;
    const unsubscribe = db
      .collection("chats")
      .doc(docid)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()?.createdAt?.toDate(),
        }));
        setMessages(updatedData);
      });

    // Hủy đăng ký lắng nghe khi component bị unmount
    return () => unsubscribe();
  };

  const getUserData = () => {
    const userRef = firebase.firestore().collection("NewUser");
    userRef
      .doc(auth.currentUser.uid)
      .get()
      .then((DocumentSnapshot) => {
        if (DocumentSnapshot.exists) {
          setUserData(DocumentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getAllMessages();
    getUserData();
  }, []);

  const onSend = (messageArray) => {
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: auth.currentUser.uid,
      sentTo: uid,
      createdAt: new Date(),
    };

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, mymsg)
    );
    const docid =
      uid > auth.currentUser.uid
        ? auth.currentUser.uid + "-" + uid
        : uid + "-" + auth.currentUser.uid;
    console.log(mymsg);

    chatRef
      .doc(docid)
      .collection("messages")
      .add({
        ...mymsg,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };

  // const renderBubble = (props) => {
  //   return (
  //     <Bubble
  //       wrapperStyle={{
  //         right: {
  //           backgroundColor: "#2e64e5",
  //         },
  //       }}
  //       textStyle={{
  //         right: {
  //           color: "#fff",
  //         },
  //       }}
  //     />
  //   );
  // };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: colorScheme === 'light' ? '#f9f9f9' : '#1e1e1e', // Nền của khung nhập tin nhắn
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'light' ? '#e6e6e6' : '#333', // Màu viền trên
        }}
        textInputStyle={{
          color: colorScheme === 'light' ? '#000' : '#fff', // Màu chữ trong khung nhập tin nhắn
          backgroundColor: colorScheme === 'light' ? '#fff' : '#2a2a2a', // Nền khung nhập
          borderRadius: 20,
          paddingHorizontal: 15,
          marginHorizontal: 10,
          marginVertical: 5,
        }}
      />
    );
  };
  

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <MaterialCommunityIcons
          name="send-circle"
          style={{ marginBottom: 5, marginRight: 5 }}
          size={40}
          color="#2e64e5"
        />
      </Send>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -170 : 0} // Nâng cao thêm một chút
    >
    <View style={[{flex:1, backgroundColor: themeContainerStyle}]}>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={(text) => onSend(text)}
        user={{
          _id: auth.currentUser.uid,
          avatar: userData ? userData.userImg || "" : "",
        }}
        // renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        scrollToBottom
      />
    </View></KeyboardAvoidingView>
  );
};
export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
});
