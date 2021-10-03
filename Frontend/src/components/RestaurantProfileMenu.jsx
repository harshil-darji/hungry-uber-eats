/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
import React, { useCallback, useState } from 'react';
import { StatefulMenu, OptionProfile } from 'baseui/menu';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import toast from 'react-hot-toast';
import jwt_decode from 'jwt-decode';

import axiosInstance from '../services/apiConfig';

export default function RestaurantProfileMenu() {
  const restaurant = useSelector((state) => state.restaurant);

  const history = useHistory();

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
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
        }
      }
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
      setRestImages(response.data.restImages);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          // history.push('/login/restaurant');
        }
        toast.error(error.response.data.error);
      }
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
      imgUrl: restImages
        ? restImages[0].imageLink
        : 'https://avatars.dicebear.com/api/human/1.svg?width=285&mood=happy',
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
