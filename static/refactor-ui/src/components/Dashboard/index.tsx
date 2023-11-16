import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { POST,GET } from "../../utils/axios";

// Defining the structure of the DashboardData interface
interface DashboardData {
  json_branch_data: any;
  json_pr_data: any;
  data: any;
}

// Functional component for the Dashboard
export const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {

    // Making a POST request to the 'api/account/dashboard/home/' endpoint
    POST('api/account/dashboard/home/')
      .then(function (response) {

        // Logging the data received from the API response
        console.log('Data:', response.data.data);

        // Updating the state with the received data
        setData(response.data);
      })
      .catch(function (error) {

        // Logging any errors that occur during the API request
        console.error('Error:', error);
      });
  }, []); // The empty dependency array ensures that the effect runs only once when the component mounts


  // JSX rendering based on the state of the 'data' variable
  return (
    <div>
      {data ? (
        <>
          <div>Branch Data: {data.data.json_branch_data}</div>
          <div>Pull Request Data: {data.data.json_pr_data}</div>
        </>
      ) : (
        // Displaying a loading message while waiting for the API response
        <p>Loading...</p>
      )}
    </div>
  );
};
