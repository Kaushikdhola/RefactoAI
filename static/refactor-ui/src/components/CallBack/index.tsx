import { GitHub } from "@mui/icons-material";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Link,
  Typography,
  typographyClasses,
} from "@mui/joy";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../App";
import { prepareQueryParamsFromObject } from "../../utils/helpers";
import axios from "axios";

export const CallBack = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const { client_id, redirect_uri, client_secret } = state;
  const params = {
    client_id: client_id,
  };

  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes("?code=");
    if (!hasCode) {
      return; 
    }

    const urlParams = new URLSearchParams(window.location.search);
    const newUrl = url.split("?code=");
    const code = urlParams.get("code");
    window.history.pushState({}, "", newUrl[0]);
    setData({ ...data, isLoading: true });
    const req_data = {"client_id":client_id,"client_secret":client_secret,"code":code};
    console.log(params);

    axios.post("http://localhost:8000/account/callback/access_token/",req_data).then(response =>{
        console.log(response.data);
      })
      .catch(error => {
          console.error(error);
      });

  }, [state, dispatch, data]);

    return (
      <div>Hello </div>
    )
};
