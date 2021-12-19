/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
import React, { useCallback, useEffect, useState } from 'react';
import { StatefulMenu, OptionProfile } from 'baseui/menu';
import { useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';

import axios from 'axios';
import customerDefaultProfile from '../assets/img/customer-default-profile.jpeg';
import { getCustomerQuery } from '../services/query';

export default function CustomerProfileMenu({ showViewAccount }) {
  const customer = useSelector((state) => state.customer);

  const [name, setname] = useState('');
  // const [address, setAddress] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [emailId, setEmail] = useState('');

  const fetchCustomerData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axios({
        url: 'http://127.0.0.1:8081/api/',
        method: 'post',
        data: {
          query: getCustomerQuery,
          variables: {
            custId: decoded.id,
          },
        },
        headers: {
          Authorization: token,
        },
      });
      const user = response.data.data.customer;
      console.log(user);
      setname(user.name);
      setEmail(user.emailId);
      setProfileImg(
        user.profileImg
          ? user.profileImg
          : customerDefaultProfile,
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchCustomerData();
  }, [customer]);

  const ITEMS = [
    {
      title: name || '',
      subtitle: emailId || '',
      body: showViewAccount ? 'View account' : '',
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
