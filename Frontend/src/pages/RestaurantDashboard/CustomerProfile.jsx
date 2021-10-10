/* eslint-disable */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-prototype-builtins */
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';
import { Table, SIZE } from 'baseui/table-semantic';
import { Display2 } from 'baseui/typography';

// eslint-disable-next-line camelcase
import axiosInstance from '../../services/apiConfig';
import customerDefaultImage from '../../assets/img/customer-default-profile.jpeg';

function CustomerProfile({ match }) {
  const history = useHistory();
  const [name, setName] = useState('');
  const [emailId, setEmail] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [dob, setDob] = useState('');
  const [nickName, setNickName] = useState('');
  const [about, setAbout] = useState('');
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [country, setCountry] = useState([]);
  const [profileImg, setProfileImg] = useState(customerDefaultImage);

  const fetchCustomerData = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axiosInstance.get(
        `customers/${match.params.custId}`,
        {
          headers: { Authorization: token },
        },
      );
      const { user } = response.data;
      console.log(user);
      setName(user.name);
      setEmail(user.emailId);
      setContactNo(user.contactNo);
      setNickName(user.nickName ? user.nickName : '');
      setDob(user.dob ? new Date(user.dob).toUTCString() : '');
      setAbout(user.about ? user.about : '');
      setCity(user.city ? user.city : '');
      setState(user.state ? user.state : '');
      setCountry(user.country ? user.country : '');
      setProfileImg(user.profileImg ? user.profileImg : customerDefaultImage);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
        }
      }
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  return (
    <Row>
      <Col xs={4}>
        <div style={{ marginTop: '30px', marginLeft: '30px' }}>
          <img
            src={profileImg || customerDefaultImage}
            alt="Customer profile"
          />
        </div>
      </Col>
      <Col>
        <div style={{ marginTop: '30px' }}>
          <Display2>{name || ''}</Display2>
          <Table
            columns={['', '']}
            data={[
              ['Email address', emailId],
              ['Contact Number', contactNo],
              ['Date of birth', dob],
              ['Nickname', nickName],
              ['About', about],
              ['City', city],
              ['State', state],
              ['Country', country],
            ]}
            size={SIZE.spacious}
          />
        </div>
      </Col>
    </Row>
  );
}

export default CustomerProfile;
