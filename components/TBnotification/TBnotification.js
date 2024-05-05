import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { auth, firebase } from "../../firebase";
import UserController from "../../controller/UserController";

const TBnotification = ({ navigation }) => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    UserController.getNotificationsForUser(auth.currentUser.uid, setUserData);

    return () => {
      UserController.thongbao();
    };
  }, [auth.currentUser.uid]);

  const handleCommentPress = (postID) => {
    navigation.navigate("Comment", { postID });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            {item.idUser != auth.currentUser.uid ? (
              <View style={styles.notificationItem}>
                {/* <Text>ID bài viết: {item.postId}</Text> */}
                {/* <Text>iduser: {item.idUser}</Text> */}
                <TouchableOpacity
                  onPress={() => handleCommentPress(item.postId)}
                >
                  <Text>"{item.name}" đã yêu thích bài viết của bạn</Text>
                  <Text style={styles.notificationTime}>
                    Email: {item.email}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:"#ffffff",
  },
  notificationItem: {
    borderBottomColor: "#ccc",
    paddingVertical: 16,
  },
  notificationTime: {
    color: "#888",
    fontSize: 14,
  },
});

export default TBnotification;
