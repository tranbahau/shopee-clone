import { Outlet } from 'react-router-dom';
import UserSideNav from '../../components/UserSideNav';
import { Fragment } from 'react';

export default function UserLayout() {
  return (
    <Fragment>
      <UserSideNav />
      <Outlet />
    </Fragment>
  );
}
