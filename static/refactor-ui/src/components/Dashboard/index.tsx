import React, { useEffect } from 'react';
import axios from 'axios';
import { POST,GET } from "../../utils/axios";

export const Dashboard = () => {
// api/github/dashboard/home
useEffect(()=>{
POST('api/account/dashboard/home/')
.then(function (response) {

  console.log('Data:', response.data);
})
.catch(function (error) {
  console.error('Error:', error);
});

})

  return (
    <div>This is your dashboard</div>

  )
}
