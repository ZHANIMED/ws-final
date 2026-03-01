import axios from "axios"


export const getFoods = () => async (dispatch) => {
  dispatch({ type: LOAD_FOOD });

  try {
    let result = await axios.get(
      "http://localhost:4321/api/food/allfood"
    );

    dispatch({ type: GET_FOOD, payload: result.data });
  } catch (error) {
    dispatch({
      type: FAIL_FOOD,
      payload: error.response.data.errors,
    });
  }
};




export const addFood = (newFood, navigate) => async (dispatch) => {
  dispatch({ type: LOAD_FOOD });

  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
      isAdmin: true,
    };

    let result = await axios.post(    "http://localhost:4321/api/food/add-food",newFood ,config );

    dispatch({ type: ADD_FOOD, payload: result.data });
    dispatch(getFood());
    navigate("/listfood");
  } catch (error) {
    dispatch({
      type: FAIL_FOOD,
      payload: error.response.data.errors,
    });
  }
};



export const deleteFood = (id) => async (dispatch) => {
  dispatch({ type: LOAD_FOOD });

  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };

    await axios.delete(
      `http://localhost:4321/api/food/${id}`,
      config
    );

    dispatch(getFood());
  } catch (error) {
    dispatch({
      type: FAIL_FOOD,
      payload: error.response.data.errors,
    });
  }
};



export const editFood = (id, newFood, navigate) => async (dispatch) => {
  dispatch({ type: LOAD_FOOD });

  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };

    await axios.put(
      `http://localhost:4321/api/food/${id}`,
      newFood,
      config
    );

    dispatch(getFood());
    navigate(-1);
  } catch (error) {
    dispatch({
      type: FAIL_FOOD,
      payload: error.response.data.errors,
    });
  }
};


export const getOneFood = (id) => async (dispatch) => {
  dispatch({ type: LOAD_FOOD });

  try {
    let result = await axios.get(
      `http://localhost:4321/api/food/${id}`
    );

    dispatch({ type: GET_ONE_FOOD, payload: result.data });
  } catch (error) {
    dispatch({
      type: FAIL_FOOD,
      payload: error.response.data.errors,
    });
  }
};
