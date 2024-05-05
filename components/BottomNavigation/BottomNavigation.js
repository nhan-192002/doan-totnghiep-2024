import { View, Text, Image,TouchableOpacity } from "react-native";
import React from "react";
import styles from "./styles";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../HomePage/HomePage";
import UserPage from "../UserPage/UserPage";
import MoreNews from "../MoreNews/MoreNews";
import Notification from "../Notification/Notification";
import Messenger from "../Messenger/Messenger";
import EditProfileScreen from '../UserPage/EditProfileScreen';
import ChatScreen from '../Messenger/ChatScreen';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TBnotification from "../TBnotification/TBnotification";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = ({navigation, route}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Trang chủ"
      component={HomePage}
      options={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: 'black',
          fontSize: 21,
        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
    <Stack.Screen
      name="HomeProfile"
      component={UserPage}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

const ProfileStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={UserPage}
      options={{
        headerTitle: "Trang cá nhân",
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5',
          fontSize: 18,
        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        title: 'Sửa thông tin',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        
      }}
    />
  </Stack.Navigator>
);

const MessageStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen name="Messages" component={Messenger} 
    options={{
      headerTitle: "Tin nhắn",
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: '#2e64e5',
        fontSize: 18,
      },
      headerStyle: {
        shadowColor: '#fff',
        elevation: 0,
      },
    }}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({route}) => ({
        title: route.params.userName,
        headerBackTitleVisible: false,
      })}
    />
  </Stack.Navigator>
);

const CustomtabBarButtom = ({children, onPress}) =>(
  <TouchableOpacity
  style={{ 
    // top: -25,
    justifyContent: 'center',
    alignItems: 'center',
    // ...styles.shadow
   }}
  onPress={onPress}>
    <View style={{ 
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#00a9e0'
     }}>
      {children}
    </View>
  </TouchableOpacity>
);

const BottomNavigation = () => {
  const getTabBarVisibility = (route) => {
    const routeName = route.state 
    ? route.state.routes[route.state.index].name
    : '';
    if(routeName === 'Chat'){
      return false;
    }
    return true;
  };
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          // position: "absolute",
          // bottom: 25,
          // left: 20,
          // right: 20,
          // elevation: 0,
          backgroundColor: "#ffffff",
          height: 70,
          // borderRadius: 15,
          // borderBottomLeftRadius: 15,
          // borderBottomEndRadius: 15,
          // borderBottomRightRadius: 15,
          justifyContent: "center",
          alignItems: "center",
          // ...styles.shadow,
        },
      }}
      style={styles.navigation1}
    >
      <Tab.Screen
        name="Trang Chủ"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                source={require("../../img/home.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? "#00a9e0" : "#003865",
                }}
              />
              <Text
                style={{ color: focused ? "#00a9e0" : "#003865", fontSize: 12 }}
              >
                Trang Chủ
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Thông Báo"
        component={Notification}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                source={require("../../img/thongbao.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? "#00a9e0" : "#003865",
                }}
              />
              <Text
                style={{ color: focused ? "#00a9e0" : "#003865", fontSize: 12 }}
              >
                Thông Báo
              </Text>
            </View>
          ),
        }}
      />

      //thông báo///////////////////////
      <Tab.Screen
        name="TB Thông Báo"
        component={TBnotification}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                source={require("../../img/thongbao.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? "#00a9e0" : "#003865",
                }}
              />
              <Text
                style={{ color: focused ? "#00a9e0" : "#003865", fontSize: 12 }}
              >
                Thông Báo
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen name="Tin Mới" component={MoreNews} 
      options={{ 
        tabBarIcon: ({focused})=>(
          <Image source={require('../../img/add.png')}
          resizeMode="contain"
          style={{
            width: 60,
            height: 60,
            tintColor: "#fff"
          }}/>
        ),
        tabBarButton: (props) => (
          <CustomtabBarButtom {...props}/>
        )
       }}/>
      <Tab.Screen
        name="Tin Nhắn"
        component={MessageStack}
        options={({route})=>({
          // tabBarVisible: getTabBarVisibility(route),
          // tabBarVisible: route.state && route.state.index === 0,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                source={require("../../img/messages.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? "#00a9e0" : "#003865",
                }}
              />
              <Text
                style={{ color: focused ? "#00a9e0" : "#003865", fontSize: 12 }}
              >
                Tin Nhắn
              </Text>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Người Dùng"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                source={require("../../img/icon-user.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? "#00a9e0" : "#003865",
                }}
              />
              <Text
                style={{ color: focused ? "#00a9e0" : "#003865", fontSize: 12 }}
              >
                Tên
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
