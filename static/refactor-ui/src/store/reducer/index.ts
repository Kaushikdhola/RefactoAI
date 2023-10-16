export const initialState = {
  isLoggedIn: JSON.parse(localStorage?.getItem("isLoggedIn") || "false") || false,
  user: JSON.parse(localStorage?.getItem("user") || "{}") || null,
  client_id: process.env.REACT_APP_GITHUB_CLIENT_ID || "Iv1.31d036d7588db7bf",
  redirect_uri: window.location.origin,
  client_secret: process.env.GITHUB_APP_SECRET || "4621fe47fc678eabcde035f7fad2b8a831130b9d",
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
