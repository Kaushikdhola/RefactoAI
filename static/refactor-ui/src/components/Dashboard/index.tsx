import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { POST,GET } from "../../utils/axios";

interface DashboardData {
  json_branch_data: any;
  json_pr_data: any;
  data: any;
}

export const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    POST('api/account/dashboard/home/')
      .then(function (response) {
        console.log('Data:', response.data.data);
        setData(response.data);
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div>
      {data ? (
        <>
          <div>Branch Data: {data.data.json_branch_data}</div>
          <div>Pull Request Data: {data.data.json_pr_data}</div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
