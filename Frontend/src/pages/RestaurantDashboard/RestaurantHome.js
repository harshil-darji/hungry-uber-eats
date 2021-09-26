import React from 'react';
import { Avatar } from 'baseui/avatar';

function RestaurantHome() {
  return (
    <div style={{ marginLeft: '25px', marginTop: '25px' }}>
      <Avatar
        overrides={{
          Avatar: {
            style: ({ $theme }) => ({
              borderTopLeftRadius: $theme.borders.radius100,
              borderTopRightRadius: $theme.borders.radius100,
              borderBottomRightRadius: $theme.borders.radius100,
              borderBottomLeftRadius: $theme.borders.radius100,
            }),
          },
          Root: {
            style: ({ $theme }) => ({
              borderTopLeftRadius: $theme.borders.radius100,
              borderTopRightRadius: $theme.borders.radius100,
              borderBottomRightRadius: $theme.borders.radius100,
              borderBottomLeftRadius: $theme.borders.radius100,
            }),
          },
        }}
        name="user name #3"
        size="scale2000"
        src="https://avatars.dicebear.com/api/human/override.svg?width=285&mood=happy"
      />
    </div>
  );
}

export default RestaurantHome;
