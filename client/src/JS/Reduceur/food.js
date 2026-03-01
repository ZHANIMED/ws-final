import {
  LOAD_FOOD,
  GET_FOOD,
  GET_ONE_FOOD,
  ADD_FOOD,
  FAIL_FOOD,
} from "../ActionType/food";

const initialState = {
  foods: [],
  oneFood: null,
  loading: false,
  errors: null,
};

export default function foodReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_FOOD:
      return { ...state, loading: true, errors: null };

    case GET_FOOD:
      return { ...state, loading: false, foods: action.payload || [], errors: null };

    case GET_ONE_FOOD:
      return { ...state, loading: false, oneFood: action.payload || null, errors: null };

    case ADD_FOOD:
      // ✅ optionnel: si tu veux ajouter directement sans attendre getFoods()
      // si tu fais déjà dispatch(getFoods()) après ADD_FOOD, ça ne change rien.
      return {
        ...state,
        loading: false,
        errors: null,
        // foods: action.payload ? [action.payload, ...state.foods] : state.foods,
      };

    case FAIL_FOOD:
      return { ...state, loading: false, errors: action.payload || "Unknown error" };

    default:
      return state;
  }
}