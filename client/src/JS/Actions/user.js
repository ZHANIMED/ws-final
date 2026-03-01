// src/JS/Actions/user.js
import axios from "axios";

import {
  REGISTER_USER,
  LOGIN_USER,
  LOAD_USER,
  FAIL_USER,
  CURRENT_USER,
  LOGOUT_USER,
} from "../ActionType/user";

export const register = (newUser) => async (dispatch) => {
  dispatch({ type: LOAD_USER });

  try {
    const result = await axios.post(
      "http://localhost:4321/api/user/register",
      newUser
    );

    dispatch({ type: REGISTER_USER, payload: result.data });
  } catch (error) {
    dispatch({
      type: FAIL_USER,
      payload: error?.response?.data?.errors || [{ msg: "Server error" }],
    });
  }
};

export const login = (user) => async (dispatch) => {
  dispatch({ type: LOAD_USER });

  try {
    const result = await axios.post(
      "http://localhost:4321/api/user/login",
      user
    );

    dispatch({ type: LOGIN_USER, payload: result.data });
  } catch (error) {
    dispatch({
      type: FAIL_USER,
      payload: error?.response?.data?.errors || [{ msg: "Server error" }],
    });
  }
};

export const current = () => async (dispatch) => {
  dispatch({ type: LOAD_USER });

  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };

    const result = await axios.get(
      "http://localhost:4321/api/user/current",
      config
    );

    dispatch({ type: CURRENT_USER, payload: result.data });
  } catch (error) {
    dispatch({
      type: FAIL_USER,
      payload: error?.response?.data?.errors || [{ msg: "Server error" }],
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT_USER });
};