import React from 'react';
import { Button } from 'baseui/button';
import { styled } from 'baseui/styles';
// import { SIZE, KIND, SHAPE } from 'baseui/button/constants';

export const ButtonMod = ({ style, ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Button style={{ ...style, justifyContent: 'center' }} {...props} />
);

export const ButtonRow = styled('div', {
  display: 'flex',
  width: '100%',
  ':not(:first-child)': {
    marginTop: '20px',
  },
});

export const ButtonContainer = styled('div', {
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'flex-start',
  flexDirection: 'column',
});
