import { View, Text, Alert, Keyboard } from 'react-native'
import { auth, firebase } from '../../firebase'
import React, { createContext, useState } from 'react'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [addData, setAddData] = useState('');

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {
                    try {
                      await auth.signInWithEmailAndPassword(email, password);
                      Keyboard.dismiss();
                      Alert.alert("Thông báo","Đăng nhập thành công",[
                        {
                          text: "Ok",
                          onPress: () => {}
                        }
                      ])
                    } catch (e) {
                      console.log(e);
                    }
                  },
                  register: async (name, email, password) => {
                    try {
                      await auth.createUserWithEmailAndPassword(email, password)
                      .then(() => {
                        const userRef = firebase.firestore().collection('NewUser');
                        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
                        const data = {
                          createAt: timestamp,
                          email: email,
                          name: name,
                          userImg: '',
                          about: '',
                          phone: '',
                          country: '',
                          city: '',
                          uid: auth.currentUser.uid,
                        };
                        userRef
                          .doc(auth.currentUser.uid)
                          .set(data)
                          .then(() => {
                            setAddData('');
                            Keyboard.dismiss();
                          })
                          .catch((error) => {
                            alert(error);
                          })
                      })
                    } catch (e) {
                      console.log(e);
                    }
                  },
                  logout: async () => {
                    try {
                      await auth.signOut();
                    } catch (e) {
                      console.log(e);
                    }
                  },
            }}
        >
            {children}
        </AuthContext.Provider>
  )
}
export default AuthProvider;