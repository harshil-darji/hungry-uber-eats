/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
import React, { useCallback, useState } from 'react';
import { StatefulMenu, OptionProfile } from 'baseui/menu';
// import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import toast from 'react-hot-toast';
import jwt_decode from 'jwt-decode';

import axiosInstance from '../services/apiConfig';
import customerDefaultProfile from '../assets/img/customer-default-profile.jpeg';

export default function CustomerProfileMenu() {
  // const restaurant = useSelector((state) => state.restaurant);

  const history = useHistory();

  const [name, setname] = useState('');
  // const [address, setAddress] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [emailId, setEmail] = useState('');

  const fetchCustomerData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`customers/${decoded.id}`, {
        headers: { Authorization: token },
      });
      console.log(response);
      setname(response.data.user.name);
      setEmail(response.data.user.emailId);
      setProfileImg(
        response.data.user.profileImg
          ? response.data.user.profileImg
          : customerDefaultProfile,
      );
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/customer');
        }
      }
    }
  }, []);

  React.useEffect(() => {
    fetchCustomerData();
  }, []);

  const ITEMS = [
    {
      title: name || '',
      subtitle: emailId || '',
      body: 'View account',
      imgUrl: profileImg,
    },
  ];

  return (
    <StatefulMenu
      items={ITEMS}
      overrides={{
        style: {
          backgroundColor: 'transparent',
          width: '100%',
          boxShadow: 'none',
          ':hover': {
            outline: 'none',
            border: 'none',
          },
          ':focus': {
            outline: 'none',
            border: 'none',
          },
        },
        List: {
          style: {
            backgroundColor: 'transparent',
            width: '100%',
            boxShadow: 'none',
            ':hover': {
              outline: 'none',
              border: 'none',
            },
            ':focus': {
              outline: 'none',
              border: 'none',
            },
          },
        },
        Option: {
          component: OptionProfile,
          props: {
            getProfileItemLabels: ({ title, subtitle, body }) => ({
              title,
              subtitle,
              body,
            }),
            getProfileItemImg: (item) => item.imgUrl,
            getProfileItemImgText: (item) => item.title,
          },
        },
      }}
    />
  );
}
