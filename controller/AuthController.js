import { Alert } from "react-native";
import AuthModel from "../model/AuthModel";

class AuthController {
  login = (email, password, onSuccess, onError) => {
    AuthModel.login(email, password)
      .then(() => {
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        Alert.alert("Thông báo!!", "Sai mật khẩu hoặc tài khoản ", [
          {
            text: "OK",
          },
        ]);

        if (onError) onError(error);
      });
  };

  logout = (onSuccess, onError) => {
    AuthModel.logout()
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        onError(error);
      });
  }

  register = (userId, data) => {
    return AuthModel.register(userId, data);
  }
}

export default new AuthController();
