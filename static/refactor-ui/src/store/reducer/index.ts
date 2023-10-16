export const initialState = {
  isLoggedIn: JSON.parse(localStorage?.getItem("isLoggedIn") || "false") || false,
  user: JSON.parse(localStorage?.getItem("user") || "{}") || null,
  client_id: process.env.REACT_APP_GITHUB_CLIENT_ID || "Iv1.59a0515e022cfba8",
  redirect_uri: window.location.origin,
  client_secret: process.env.GITHUB_APP_SECRET || "c2591257e5a9b515f3111888bcb8a99c2df46674",
};

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN": {
      localStorage.setItem(
        "isLoggedIn",
        JSON.stringify(action?.payload?.isLoggedIn)
      );
      localStorage.setItem("user", JSON.stringify(action?.payload?.user));
      return {
        ...state,
        isLoggedIn: action?.payload?.isLoggedIn,
        user: action?.payload?.user,
      };
    }
    case "LOGOUT": {
      localStorage.clear();
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    }
    default:
      return state;
  }
};
