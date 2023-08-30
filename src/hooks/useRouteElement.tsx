import { useContext, lazy, Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { path } from 'src/constant/path';
import AppContext from 'src/context/app.context';
import CartLayout from 'src/layout/CartLayout';
import MainLayout from 'src/layout/MainLayout';
import RegisterLayout from 'src/layout/RegisterLayout';

const Login = lazy(() => import('src/pages/Login'));
const Register = lazy(() => import('src/pages/Register'));
const Cart = lazy(() => import('src/pages/Cart'));
const ProductList = lazy(() => import('src/pages/ProductList'));
const ProductDetails = lazy(() => import('src/pages/ProductList/components/ProductDetails'));
const UserLayout = lazy(() => import('src/pages/User/layout/UserLayout'));
const Profile = lazy(() => import('src/pages/User/pages/Profile'));
const ChangePassword = lazy(() => import('src/pages/User/pages/ChangePassword'));
const HistoryPuchase = lazy(() => import('src/pages/User/pages/HistoryPurchase'));
const NotFound = lazy(() => import('src/pages/NotFound'));

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);

  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />;
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);

  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />;
}

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
      path: path.home,
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: path.home,
      element: <RejectedRoute />,
      children: [
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },

    {
      path: path.home,
      element: <ProtectedRoute />,
      children: [
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: (
                <Suspense>
                  <Profile />
                </Suspense>
              )
            },
            {
              path: path.purchaseHistory,
              element: (
                <Suspense>
                  <HistoryPuchase />
                </Suspense>
              )
            },
            {
              path: path.changePassword,
              element: (
                <Suspense>
                  <ChangePassword />
                </Suspense>
              )
            }
          ]
        },
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        }
      ]
    },
    {
      path: path.productDetails,
      element: (
        <MainLayout>
          <Suspense>
            <ProductDetails />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <Suspense>
            <NotFound />
          </Suspense>
        </MainLayout>
      )
    }
  ]);

  return routeElement;
}
