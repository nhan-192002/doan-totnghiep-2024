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
import IndexModel from "../model/IndexModel";

class UserController {
  //userpage
  observeData(userId, onDataReceived) {
    return IndexModel.getData(userId, onDataReceived);
  }
  getUserData(userId, onDataReceived) {
    IndexModel.getUserData(userId, onDataReceived);
  }

  //homepage

  startListening(onDataChange) {
    IndexModel.fetchData(onDataChange);
  }
  stopListening() {
    IndexModel.stopListening();
  }

  //like
  async toggleLike(postId, currentUserUid) {
    try {
      const postData = await IndexModel.getPost(postId);

      if (postData) {
        let updatedLikes = [...postData.likes];

        if (updatedLikes.includes(currentUserUid)) {
          updatedLikes = updatedLikes.filter((uid) => uid !== currentUserUid);
        } else {
          updatedLikes.push(currentUserUid);
        }

        await IndexModel.updatePostLikes(postId, updatedLikes);
        return updatedLikes;
      }
    } catch (error) {
      console.error("Toggle like error:", error);
      throw error;
    }
  }

  //postcard
  // Lấy dữ liệu người dùng theo userId
  getUserDataCard(userId, setUserData) {
    const userRef = IndexModel.getUserDataCard(userId, setUserData);
    userRef.get().then((doc) => {
      setUserData(doc.data());
    });
  }
  // Lắng nghe thay đổi dữ liệu người dùng port card
  subscribeToUserData(userId, onUpdate) {
    const unsubscribe = IndexModel.subscribeToUserData(userId, onUpdate);
    return unsubscribe;
  }

  //delete bài viết
  handleDelete(postId) {
    Alert.alert(
      "Xoá bài",
      "Bạn có muốn xoá bài không?",
      [
        {
          text: "Không",
          onPress: () => console.log("Không xoá!"),
          style: "cancel",
        },
        {
          text: "Có",
          onPress: () => this.deletePost(postId),
        },
      ],
      { cancelable: false }
    );
  }
  deletePost(postId) {
    IndexModel.deletePost(postId)
      .then(() => {
        Alert.alert("Đã xoá bài");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Lỗi khi xoá bài", error.message);
      });
  }

  //tải dữ liệu bài viết cmt
  async fetchPostData(postID, setData) {
    try {
      const data = await IndexModel.fetchPostData(postID);
      if (data) {
        setData([data]); // Convert the single document into an array
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  //tải dữ liệu CMT
  fetchPostDataCMT(postID, setConnectedData) {
    IndexModel.fetchPostDataCMT(postID, setConnectedData);
  }
  unsubscribeFromConnectedData() {
    IndexModel.unsubscribeFromConnectedData();
  }

  //tải cmt lên firebase
  async postComment(postID, comment, currentUserUid) {
    try {
      const result = await IndexModel.postComment(
        postID,
        comment,
        currentUserUid
      );
      return result;
    } catch (error) {
      console.log("Lỗi khi tải lên bình luận: ", error);
      throw error;
    }
  }

  //xóa cmt
  async deleteCommentByIndex(postID, index) {
    try {
      const result = await IndexModel.deleteCommentByIndex(postID, index);
      return result;
    } catch (error) {
      console.log("Lỗi khi xóa bình luận: ", error);
      throw error;
    }
  }

  //tìm kiếm
  async findUserByName(name) {
    try {
      const data = await IndexModel.findUserByName(name);
      return data;
    } catch (error) {
      console.error("Error finding user by name:", error);
      throw error;
    }
  }

  //thông báo
  getNotificationsForUser(userId, setUserData) {
    return IndexModel.getNotificationsForUser(userId, setUserData);
  }
  thongbao() {
    IndexModel.thongbao();
  }

  //hiển thị user nhắn tin
  dataMessenger(userId, setData) {
    return IndexModel.dataMessenger(userId, setData);
  }
  loadingMessenger() {
    IndexModel.loadingMessenger();
  }

  //sửa Profile
  getUserDataProfile = (userId) => {
    return IndexModel.getUserDataProfile(userId);
  };
  updateUserData = (userId, userData) => {
    return IndexModel.updateUserData(userId, userData);
  };
  uploadImage = (uri) => {
    return IndexModel.uploadImage(uri);
  };

  //upload bài viết
  uploadImagePosts(imageUri, text, userId) {
    try {
      return IndexModel.uploadImagePosts(imageUri, text, userId);
    } catch (error) {
      alert(error);
    }
  }
  uploadTextPosts(text, userId) {
    try {
      return IndexModel.uploadTextPosts(text, userId);
    } catch (error) {
      alert(error);
    }
  }

  //HIển thị follow
  dataFollow = (userId, clientId, setFollow, setNumberFollow) => {
    try {
      return IndexModel.dataFollow(userId, clientId, setFollow, setNumberFollow);
    } catch (error) {
      alert(error);
    }
  };

  //delete and add follow
  handleAddToDeleteFollower = (userId, clientId, setFollow) =>{
    try {
      return IndexModel.handleAddToDeleteFollower(userId, clientId, setFollow);
    } catch (error) {
      alert(error);
    }
  }
}

export default new UserController();
