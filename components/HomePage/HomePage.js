import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  useColorScheme,
  styles
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, firebase, app, firebaseConfig } from "../../firebase";

import axios from "axios";

import UserController from "../../controller/UserController";

import "firebase/firestore";
import PortCard from "./PortCard";
import { LinearGradient } from 'expo-linear-gradient';
import { SERVER_IP, SERVER_PORT } from "../../config";


const HomePage = ({ navigation }) => {
  const [data, setData] = useState([]);
  // const [suggestedUsers, setSuggestedUsers] = useState([]);
  const colorScheme = useColorScheme();

  // const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  // const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const gradientColors = colorScheme === 'dark' 
    ? ['#434343', '#000000'] // Màu cho chế độ Dark
    : ['#EEEEEE', '#888888']; // Màu cho chế độ Light

    const [posts, setPosts] = useState([]); // Danh sách bài viết đề xuất từ API
const [filteredPosts, setFilteredPosts] = useState([]); // Danh sách bài viết sau khi lọc từ Firestore
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Hàm gọi API Flask để nhận bài viết đề xuất
const fetchRecommendedPosts = async () => {
  const userId = auth.currentUser.uid; // ID người dùng hiện tại
  setLoading(true);
  setError(null);

  try {
    const response = await axios.get(`http://${SERVER_IP}:${SERVER_PORT}/recommend`, {
      params: { user_id: userId },
    });

    // Cập nhật bài viết nhận được vào state
    setPosts(response.data);
  } catch (err) {
    setError("There was an error fetching the recommended posts.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

// Lọc bài viết từ Firestore dựa trên danh sách được đề xuất
const fetchPostsFromFirestore = () => {
  if (posts.length === 0) return; // Nếu posts chưa có dữ liệu thì không cần làm gì

  firebase.firestore()
    .collection("MoreNews")
    .where(firebase.firestore.FieldPath.documentId(), "in", posts) // Lọc các bài viết có ID trùng với danh sách posts
    .get()
    .then((snapshot) => {
      const filtered = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sắp xếp lại các bài viết theo thứ tự trong mảng posts
      const sortedPosts = filtered.sort((a, b) => {
        const indexA = posts.indexOf(a.id);
        const indexB = posts.indexOf(b.id);
        return indexA - indexB; // Thứ tự theo mảng posts
      });

      setFilteredPosts(sortedPosts); // Cập nhật bài viết đã lọc và sắp xếp vào state
    })
    .catch((err) => {
      setError("There was an error fetching posts from Firestore.");
      console.error(err);
    });
};

// Lắng nghe sự thay đổi của MoreNews
useEffect(() => {
  const unsubscribe = firebase
    .firestore()
    .collection("MoreNews")
    .onSnapshot((snapshot) => {
      const addedDocs = snapshot.docChanges().filter(change => change.type === 'added');
      const modifiedDocs = snapshot.docChanges().filter(change => change.type === 'modified');
      const removedDocs = snapshot.docChanges().filter(change => change.type === 'removed');

      // Kiểm tra nếu có bài viết mới được thêm vào
      if (addedDocs.length > 0 || removedDocs.length > 0) {
        console.log("New posts added, calling API...");
        fetchRecommendedPosts(); // Gọi API để lấy bài viết đề xuất mới
      }

      // Kiểm tra nếu có nội dung bài viết thay đổi
      if (modifiedDocs.length > 0) {
        console.log("Posts modified, updating content...");
        // Cập nhật nội dung bài viết thay đổi mà không gọi API
        modifiedDocs.forEach(change => {
          const updatedPost = change.doc.data();
          console.log("Updated post:", updatedPost);
          // Cập nhật lại bài viết trong state (ví dụ: setFilteredPosts hoặc setPosts)
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.id === change.doc.id ? { ...post, ...updatedPost } : post
            )
          );
        });
      }
    });

  // Hủy lắng nghe khi component bị hủy
  return () => unsubscribe();
}, []); // Chạy một lần khi component được gắn vào

// Lọc bài viết từ Firestore sau khi danh sách `posts` thay đổi
useEffect(() => {
  if (posts.length > 0) {
    fetchPostsFromFirestore(); // Cập nhật bài viết đã lọc từ Firestore
  }
}, [posts]); // Chỉ chạy khi danh sách bài viết đề xuất (`posts`) thay đổi


  console.log(posts);
  console.log('data',filteredPosts);

  //hiện thị dữ liệu
  // useEffect(() => {
  //   UserController.startListening(setData);

  //   return () => {
  //     UserController.stopListening();
  //   };
  // }, []);


  // Gọi hàm lưu bài viết vào Firestore khi posts thay đổi

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
    <LinearGradient colors={gradientColors} style={{ justifyContent: 'center', alignItems: 'center',  }}>
      <View style={{ width: '95%' }}>
        <FlatList
          data={filteredPosts}
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
    </LinearGradient>
  );
};

export default HomePage;
