import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, firebase, app, firebaseConfig } from "../../firebase";


import UserController from "../../controller/UserController";

import "firebase/firestore";
import PortCard from "./PortCard";

const HomePage = ({ navigation }) => {
  const [data, setData] = useState([]);


  //hiện thị dữ liệu
  useEffect(() => {
    UserController.startListening(setData);

    return () => {
      UserController.stopListening();
    };
  }, []);

    //like bài viết
    const onLike = async (item) => {
      try {
         UserController.toggleLike(item.id, auth.currentUser.uid);
      } catch (error) {
        console.error('Update like error:', error);
      }
    };

  const onComment = (item) => {
    navigation.navigate("Comment", {
      postID: item.id,
      comments: item.comments,
    });
  };

  // xóa bài viết
  const onPostDelete = (postId) => {
    UserController.handleDelete(postId);
  };
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center',  }}>
      <View style={{ width: '95%' }}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <PortCard
              item={item}
              onLike={onLike}
              onComment={onComment}
              onDelete={() => onPostDelete(item.id)}
              onPress={() =>
                navigation.navigate("HomeProfile", { userId: item.user })
              }
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default HomePage;
