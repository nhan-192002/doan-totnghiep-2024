import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebase, database, auth } from "../firebase";

class AuthModel {
  login = (email, password) => {
    return new Promise((resolve, reject) => {
      const auth = getAuth();

      // signInWithEmailAndPassword(auth, 'nhan1@gmail.com', 'nhan123')
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  logout = () => {
    return new Promise(async (resolve, reject) => {
      const auth = getAuth();
      try {
        await auth.signOut();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  register = (userId, data) => {
    return new Promise((resolve, reject) => {
      const userRef = firebase.firestore().collection("NewUser");
      userRef
        .doc(userId)
        .set(data)
        .then(() => {
          resolve("Complete registration");
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}

export default new AuthModel();
