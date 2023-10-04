export const initialState = {
  isLoggedIn: JSON.parse(localStorage?.getItem("isLoggedIn") || "false") || false,
  user: JSON.parse(localStorage?.getItem("user") || "{}") || null,
  client_id: process.env.REACT_APP_GITHUB_CLIENT_ID || "c16161d4a4e7625ba6e1",
  redirect_uri: window.location.origin,
  client_secret: process.env.GITHUB_APP_SECRET || "9214d0a78dc4fd1771db92f70f0f55260700f440",
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
