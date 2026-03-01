// src/JS/Reduceur/user.js
import {
  REGISTER_USER,
  LOGIN_USER,
  LOAD_USER,
  FAIL_USER,
  LOGOUT_USER,
  CURRENT_USER,
} from "../ActionType/user";

const initialeState = {
  user: null,
  loadUser: false,
  isAuth: false,
  newUser: {},
  isAdmin: false,
  errors: null,
};

const userReducer = (state = initialeState, { type, payload }) => {
  switch (type) {
    case LOAD_USER:
      return { ...state, loadUser: true };

    case REGISTER_USER:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        loadUser: false,
        user: { ...payload.user, password: null },
        isAuth: true,
        // ✅ ajout
        isAdmin: payload.isAdmin ?? payload.user?.isAdmin ?? false,
        errors: null,
      };

    case LOGIN_USER:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        loadUser: false,
        user: { ...payload.user, password: null },
        isAuth: true,
        isAdmin: payload.isAdmin ?? payload.user?.isAdmin ?? false,
        errors: null,
      };

    case CURRENT_USER:
      return {
        ...state,
        user: { ...payload, password: null },
        isAuth: true,
        isAdmin: payload.isAdmin ?? payload?.isAdmin ?? false,
        loadUser: false,
        errors: null,
      };

    case FAIL_USER:
      return { ...state, loadUser: false, errors: payload };

    case LOGOUT_USER:
      localStorage.removeItem("token");
      return {
        user: null,
        loadUser: false,
        isAuth: false,
        newUser: {},
        errors: null,
        isAdmin: false,
      };

    default:
      return state;
  }
};

export default userReducer;