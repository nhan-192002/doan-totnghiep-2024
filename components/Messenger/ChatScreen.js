import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text, Button, StyleSheet } from "react-native";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { auth, firebase } from "../../firebase";

const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const { uid } = route.params;
  const chatRef = firebase.firestore().collection("chats");
  const db = firebase.firestore();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    navigation.getParent().setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      navigation.getParent().setOptions({ tabBarStyle: { display: "flex" } });
    };
  }, []);

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
      scrollToBottom
    />
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
