import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppLogin from './components/login/AppLogin';
import AppRegister from './components/register/AppRegister';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/body/Home';
import Setting from './components/body/Setting';
// import BottomNavigation from './components/BottomNavigation/BottomNavigation';
import DemoImg from './components/body/DemoImg';
import AppStack from './components/BottomNavigation/AppStack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <NavigationContainer>
    //   {/* <AppLogin></AppLogin> */}
    //   {/* <Home></Home> */}
    //   {/* <Setting></Setting> */}
    //   {/* <AppLogout/> */}
    //   <AppStack/>
    //   {/* <DemoImg/> */}
    // </NavigationContainer>
    <NavigationContainer>
       <Stack.Navigator initialRouteName='AppLogin' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AppLogin" component={AppLogin} />
        <Stack.Screen name="AppRegister" component={AppRegister} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="AppStack" component={AppStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
