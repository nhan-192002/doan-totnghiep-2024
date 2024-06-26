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

import axios from "axios";

import UserController from "../../controller/UserController";

import "firebase/firestore";
import PortCard from "./PortCard";

const HomePage = ({ navigation }) => {
  const [data, setData] = useState([]);
  // const [suggestedUsers, setSuggestedUsers] = useState([]);


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

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://10.0.0.1:6666/get_recommend_articles",
  //       {
  //         uid: auth.currentUser?.uid,
  //       }
  //     );
  //     setSuggestedUsers(response.data.suggested_users);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  //   console.log(suggestedUsers);
  // }, []);
  
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
