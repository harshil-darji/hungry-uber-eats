/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
import React, { useCallback, useState } from 'react';
import { StatefulMenu, OptionProfile } from 'baseui/menu';
import { useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';

import axiosInstance from '../services/apiConfig';

import CustomerDefaultProfile from '../assets/img/customer-default-profile.jpeg';

export default function RestaurantProfileMenu() {
  const restaurant = useSelector((state) => state.restaurant);

  const [name, setname] = useState('');
  const [address, setAddress] = useState('');
  const [restImages, setRestImages] = useState(null);
  const [emailId, setEmail] = useState('');

  const fetchRestaurantData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`/restaurants/${decoded.id}`, {
        headers: { Authorization: token },
      });
      setname(response.data.rest.name);
      setEmail(response.data.rest.emailId);
      setAddress(response.data.rest.address ? response.data.rest.address : '');
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getRestaurantImages = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      const response = await axiosInstance.get(
        `restaurants/${decoded.id}/images`,
        {
          headers: { Authorization: token },
        },
      );
      setRestImages(
        response.data.restImages?.length > 0
          ? response.data.restImages[0].imageLink
          : CustomerDefaultProfile,
      );
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getRestaurantImages();
    fetchRestaurantData();
  }, [restaurant]);

  const ITEMS = [
    {
      title: name || '',
      subtitle: address || '',
      body: emailId || '',
      imgUrl: restImages,
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
