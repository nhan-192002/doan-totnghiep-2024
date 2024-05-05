import { firebase, auth } from "../firebase";

class IndexModel {
  //userpage
  getData(userId, onDataReceived) {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("MoreNews")
      .where("user", "==", userId)
      .orderBy("time", "desc")
      .onSnapshot((snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          time: doc.data()?.time?.toDate(),
        }));
        onDataReceived(updatedData);
      });
    return unsubscribe;
  }
  getUserData(userId, onDataReceived) {
    const userRef = firebase.firestore().collection("NewUser").doc(userId);

    // Sử dụng onSnapshot để lắng nghe thay đổi trong tài liệu NewUser
    userRef.onSnapshot((userSnapshot) => {
      if (userSnapshot.exists) {
        // Gọi onDataReceived với dữ liệu khi có thay đổi
        onDataReceived(userSnapshot.data());
      }
    });
  }

  //like post
  async getPost(postId) {
    const postRef = firebase.firestore().collection("MoreNews").doc(postId);
    const postDoc = await postRef.get();
    if (postDoc.exists) {
      return postDoc.data();
    }
    return null;
  }
  async updatePostLikes(postId, updatedLikes) {
    const postRef = firebase.firestore().collection("MoreNews").doc(postId);
    await postRef.update({ likes: updatedLikes });
  }

  //homepage
  // constructor() {
  //   this.unsubscribe = null;
  // }
  fetchData(onDataChange) {
    this.unsubscribe = firebase
      .firestore()
      .collection("MoreNews")
      .orderBy("time", "desc")
      .onSnapshot((snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          time: doc.data()?.time?.toDate(),
        }));
        onDataChange(updatedData);
      });
    return () => this.unsubscribe();
  }
  stopListening() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  //portcard
  getUserDataCard(userId, setUserData) {
    const userRef = firebase.firestore().collection("NewUser").doc(userId);
    return userRef;
  }
  // Lắng nghe thay đổi dữ liệu người dùng portcard
  subscribeToUserData(userId, onUpdate) {
    const userRef = firebase.firestore().collection("NewUser").doc(userId);
    return userRef.onSnapshot((doc) => {
      onUpdate(doc.data());
    });
  }

  //delete bài viết
  deletePost(postId) {
    return new Promise((resolve, reject) => {
      const postRef = firebase.firestore().collection("MoreNews");
      postRef
        .doc(postId)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            const { image } = documentSnapshot.data();

            if (image !== "") {
              const storageRef = firebase.storage().refFromURL(image);
              const imageRef = firebase.storage().ref(storageRef.fullPath);

              imageRef
                .delete()
                .then(() => {
                  this.deletePostInFirebase(postId)
                    .then(() => resolve())
                    .catch((error) => reject(error));
                })
                .catch((error) => reject(error));
            } else {
              this.deletePostInFirebase(postId)
                .then(() => resolve())
                .catch((error) => reject(error));
            }
          }
        })
        .catch((error) => reject(error));
    });
  }
  deletePostInFirebase(postId) {
    return new Promise((resolve, reject) => {
      const postRef = firebase.firestore().collection("MoreNews");
      postRef
        .doc(postId)
        .delete()
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }

  //tải dữ liệu bài viết cmt
  async fetchPostData(postID) {
    try {
      const docRef = firebase.firestore().collection("MoreNews").doc(postID);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        return { id: docSnapshot.id, ...docSnapshot.data() };
      } else {
        console.log("Document does not exist");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  //tải dữ liệu CMT
  fetchPostDataCMT(postID, setConnectedData) {
    const userRef = firebase.firestore().collection("MoreNews").doc(postID);
    this.unsubscribe = userRef.onSnapshot((documentSnapshot) => {
      if (documentSnapshot.exists) {
        const data = documentSnapshot.data();
        const commentsData = data.comments || [];

        const userPromises = [];

        commentsData.forEach((comment) => {
          const userId = comment.userId;
          const userRef = firebase
            .firestore()
            .collection("NewUser")
            .doc(userId);
          userPromises.push(userRef.get());
        });

        Promise.all(userPromises)
          .then((userSnapshots) => {
            const updatedConnectedData = userSnapshots.map(
              (snapshot, index) => ({
                ...snapshot.data(),
                comment: commentsData[index].comment,
              })
            );
            setConnectedData(updatedConnectedData);
          })
          .catch((error) => {
            console.log("Lỗi khi lấy dữ liệu người dùng: ", error);
          });
      }
    });
  }
  unsubscribeFromConnectedData() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  //tải cmt lên firebase
  async postComment(postID, comment, currentUserUid) {
    try {
      const userRef = firebase.firestore().collection("MoreNews").doc(postID);
      const commentData = {
        userId: currentUserUid,
        comment: comment,
      };

      await userRef.update({
        comments: firebase.firestore.FieldValue.arrayUnion(commentData),
      });
      return "Đã tải lên bình luận thành công";
    } catch (error) {
      console.log("Lỗi khi tải lên bình luận: ", error);
      throw error;
    }
  }

  //xóa cmt
  async deleteCommentByIndex(postID, index) {
    try {
      const userRef = firebase.firestore().collection("MoreNews").doc(postID);
      const documentSnapshot = await userRef.get();

      if (documentSnapshot.exists) {
        const data = documentSnapshot.data();
        const commentsData = data.comments || [];

        // Xác định index hợp lệ
        if (index >= 0 && index < commentsData.length) {
          const updatedComments = commentsData.filter(
            (comment, i) => i !== index
          );

          await userRef.update({ comments: updatedComments });
          return "Đã xóa phần tử thành công";
        } else {
          return "Index không hợp lệ";
        }
      } else {
        return "Document không tồn tại";
      }
    } catch (error) {
      console.log("Lỗi khi xóa phần tử: ", error);
      throw error;
    }
  }
  //tim kiếm
  // async findUserByName(name) {
  //   try {
  //     const querySnapshot = await firebase
  //       .firestore()
  //       .collection("NewUser")
  //       .where("name", ">=", name)
  //       .where("name", "<=", name + "\uf8ff") // \uf8ff là một ký tự Unicode sau ký tự "z" trong bảng mã Unicode, đảm bảo tìm kiếm theo phần đầu của tên.
  //       .orderBy("name")
  //       .get();
  //     const data = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     return data;
  //   } catch (error) {
  //     console.error("Error finding user by name:", error);
  //     throw error;
  //   }
  // }
  //tim kiếm
  async findUserByName(name) {
    try {
      if (!name) {
        // Xử lý trường hợp name là null hoặc undefined
        return [];
      }

      const normalizedSearchName = this.removeDiacritics(name.toLowerCase()); // Chuyển tất cả thành chữ thường và loại bỏ dấu

      const querySnapshot = await firebase
        .firestore()
        .collection("NewUser")
        .orderBy("name")
        .get();

      const data = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => {
          // Kiểm tra xem user.name có tồn tại không
          if (user.name) {
            const normalizedUserName = this.removeDiacritics(
              user.name.toLowerCase()
            );
            return (
              normalizedUserName.includes(normalizedSearchName) ||
              normalizedSearchName.includes(normalizedUserName)
            );
          }
          return false;
        });

      return data;
    } catch (error) {
      console.error("Error finding user by name:", error);
      throw error;
    }
  }

  // Hàm loại bỏ dấu
  removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  //Thông báo
  getNotificationsForUser = (userId, setUserData) => {
    const db = firebase.firestore();

    const unsubscribe = db
      .collection("MoreNews")
      .where("user", "==", userId)
      .onSnapshot((querySnapshot) => {
        const userPromises = [];

        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          const likesMap = postData.likes || {};
          const userIds = Object.values(likesMap);

          userIds.forEach((userId) => {
            const userPromise = db
              .collection("NewUser")
              .doc(userId)
              .get()
              .then((userDoc) => {
                if (userDoc.exists) {
                  const userData = userDoc.data();
                  return {
                    postId: doc.id,
                    name: userData.name,
                    email: userData.email,
                    idUser: userData.uid,
                    time: userData.time,
                  };
                }
                return null;
              });
            userPromises.push(userPromise);
          });
        });

        Promise.all(userPromises)
          .then((results) => {
            const filteredUserData = results.filter((user) => user !== null);
            // Sắp xếp mảng theo thứ tự mới nhất (ngược lại của thời gian thêm mới)
            filteredUserData.sort((a, b) => b.time - a.time);
            setUserData(filteredUserData);
          })
          .catch((error) => {
            console.log("Lỗi khi lấy dữ liệu người dùng: ", error);
          });
      });
    return unsubscribe;
  };
  thongbao() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  //hiển thị user nhắn tin
  dataMessenger(userId, setData) {
    const db = firebase.firestore();
    // Truy cập vào tài liệu "NewUser" của người dùng hiện tại
    const userRef = db.collection("NewUser").doc(userId);

    // Lấy dữ liệu của người dùng hiện tại
    userRef.onSnapshot((userDoc) => {
      if (userDoc.exists) {
        const userData = userDoc.data();
        const followData = userData.follow || []; // Lấy dữ liệu từ cột "follow" hoặc một mảng rỗng

        // Thực hiện truy vấn Firestore chỉ nếu `followData` không rỗng
        if (followData.length > 0) {
          return db
            .collection("NewUser")
            .where("uid", "!=", userId)
            .where("uid", "in", followData)
            .onSnapshot((snapshot) => {
              const updatedData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setData(updatedData);
            });
        } else {
          setData(null);
        }
      }
    });
  }

  loadingMessenger() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  //sửa Profile
  getUserDataProfile = (userId) => {
    return new Promise((resolve, reject) => {
      const userRef = firebase.firestore().collection("NewUser");
      userRef
        .doc(userId)
        .get()
        .then((DocumentSnapshot) => {
          if (DocumentSnapshot.exists) {
            resolve(DocumentSnapshot.data());
          } else {
            reject("User not found");
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  updateUserData = (userId, userData) => {
    return new Promise((resolve, reject) => {
      const userRef = firebase.firestore().collection("NewUser");
      userRef
        .doc(userId)
        .update(userData)
        .then(() => {
          resolve("Update completed");
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  uploadImage = (uri) => {
    return new Promise((resolve, reject) => {
      fetch(uri)
        .then((response) => response.blob())
        .then((blob) => {
          const filename = uri.substring(uri.lastIndexOf("/") + 1);
          const ref = firebase.storage().ref().child(filename);

          ref
            .put(blob)
            .then(() => {
              firebase
                .storage()
                .ref(filename)
                .getDownloadURL()
                .then((url) => {
                  resolve(url);
                })
                .catch((error) => {
                  reject(error);
                });
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  //upload bài viết
  async uploadImagePosts(imageUri, text, userId) {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const ref = firebase.storage().ref().child(filename);

      await ref.put(blob);
      const downloadURL = await ref.getDownloadURL();

      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        image: downloadURL,
        text: text,
        user: userId,
        time: timestamp,
        likes: [],
        comments: [],
        report: 0,
      };

      const result = await firebase
        .firestore()
        .collection("MoreNews")
        .add(data);
      return result.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async uploadTextPosts(text, userId) {
    try {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        image: "",
        text: text,
        user: userId,
        time: timestamp,
        likes: [],
        comments: [],
        report: 0,
      };

      const result = await firebase
        .firestore()
        .collection("MoreNews")
        .add(data);
      return result.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //hiển thị follow
  // Hàm để lấy và lắng nghe dữ liệu follow
  dataFollow = async (userId, clientId, setFollow, setNumberFollow) => {
    try {
      const userRef = firebase.firestore().collection("NewUser").doc(userId);

      // Sử dụng onSnapshot để lắng nghe thay đổi trong tài liệu NewUser
      userRef.onSnapshot((userSnapshot) => {
        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          const followData = userData.follow || [];
          const numberOfFollow = followData.length;
          setNumberFollow(numberOfFollow);

          // Tiếp theo, bạn có thể làm gì đó với dữ liệu trong mảng followData
          // Ví dụ, in ra từng giá trị trong mảng:
          followData.forEach((followItem) => {
            // So sánh từng giá trị với clientId
            if (followItem === clientId) {
              setFollow(clientId);
            }
          });
        } else {
          console.log("Không tìm thấy tài liệu người dùng.");
        }
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu: ", error);
    }
  };

  // Hàm thêm hoặc xóa theo dõi
  handleAddToDeleteFollower = async (userId, clientId, setFollow) => {
    try {
      const userRef = firebase.firestore().collection("NewUser").doc(userId);

      // Lấy dữ liệu hiện tại từ cột "follow" trong tài liệu NewUser
      const userSnapshot = await userRef.get();
      if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        const followData = userData.follow || [];

        // Kiểm tra xem người dùng đã theo dõi người này chưa
        if (followData.includes(clientId)) {
          // Nếu đã theo dõi, loại bỏ ID của người dùng khỏi mảng "follow"
          const updatedFollowData = followData.filter((id) => id !== clientId);

          // Cập nhật dữ liệu trong Firestore
          await userRef.update({ follow: updatedFollowData });

          console.log("Đã xóa khỏi danh sách theo dõi.");
          setFollow(null);
        } else {
          // Nếu chưa theo dõi, thêm ID của người dùng hiện tại vào mảng "follow"
          followData.push(clientId);

          // Cập nhật dữ liệu trong Firestore
          await userRef.update({ follow: followData });

          console.log("Đã thêm vào danh sách theo dõi.");
          setFollow(clientId);
        }
      } else {
        console.log("Không tìm thấy tài liệu người dùng.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu: ", error);
    }
  };
}

export default new IndexModel();
