import axios from "axios";
import {
  GET_FOOD,
  LOAD_FOOD,
  FAIL_FOOD,
  ADD_FOOD,
  GET_ONE_FOOD,
} from "../ActionType/food";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4321";

// helper pour message d'erreur
const getErrMsg = (error) => {
  const status = error?.response?.status;
  const msg =
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    "Unknown error";
  return status ? `${status} - ${msg}` : msg;
};

// ✅ IMPORTANT: ton backend attend "authorization" (minuscule) + token direct
const authConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      authorization: token || "",
      // ⚠️ Ne pas définir Content-Type ici (Axios gère FormData)
    },
  };
};

// ✅ GET ALL
export const getFoods = () => async (dispatch) => {
  dispatch({ type: LOAD_FOOD });
  try {
    const { data } = await axios.get(`${API_URL}/api/food/allfood`);
    dispatch({ type: GET_FOOD, payload: data?.listFood ?? [] });
  } catch (error) {
    dispatch({ type: FAIL_FOOD, payload: getErrMsg(error) });
  }
};

// ✅ ADD (FormData)
export const addFood = (formData, navigate) => async (dispatch) => {
  dispatch({ type: LOAD_FOOD });

  try {
    if (!(formData instanceof FormData)) {
      throw new Error("addFood expects FormData");
    }

    const { data } = await axios.post(
      `${API_URL}/api/food/add-food`,
      formData,
      authConfig()
    );

    dispatch({ type: ADD_FOOD, payload: data?.newFood });
    dispatch(getFoods());

    if (typeof navigate === "function") navigate("/foodlist");
  } catch (error) {
    dispatch({ type: FAIL_FOOD, payload: getErrMsg(error) });
  }
};

// ✅ DELETE
export const deleteFood = (id) => async (dispatch) => {
  dispatch({ type: LOAD_FOOD });

  try {
    await axios.delete(`${API_URL}/api/food/${id}`, authConfig());
    dispatch(getFoods());
  } catch (error) {
    dispatch({ type: FAIL_FOOD, payload: getErrMsg(error) });
  }
};

// ✅ EDIT (JSON ou FormData) => support photo
export const editFood =
  (id, updatedFoodOrFormData, navigate) => async (dispatch) => {
    dispatch({ type: LOAD_FOOD });

    try {
      if (!id) throw new Error("Missing food id");

      const isFormData = updatedFoodOrFormData instanceof FormData;
      let payload = updatedFoodOrFormData;

      // ✅ si JSON : normaliser price
      if (!isFormData) {
        payload = { ...(updatedFoodOrFormData || {}) };

        if (
          payload.price !== undefined &&
          payload.price !== null &&
          payload.price !== ""
        ) {
          const num = Number(payload.price);
          if (Number.isNaN(num)) throw new Error("Price must be a number");
          payload.price = num;
        }
      }

      await axios.put(`${API_URL}/api/food/${id}`, payload, authConfig());

      dispatch(getFoods());
      if (typeof navigate === "function") navigate(-1);
    } catch (error) {
      dispatch({ type: FAIL_FOOD, payload: getErrMsg(error) });
    }
  };

// ✅ GET ONE
export const getOneFood = (id) => async (dispatch) => {
  dispatch({ type: LOAD_FOOD });

  try {
    if (!id) throw new Error("Missing food id");

    const { data } = await axios.get(`${API_URL}/api/food/${id}`, authConfig());
    dispatch({ type: GET_ONE_FOOD, payload: data?.foodToGet });
  } catch (error) {
    dispatch({ type: FAIL_FOOD, payload: getErrMsg(error) });
  }
};