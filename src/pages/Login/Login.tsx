import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import authApi from 'src/api/auth.api';
import { ErrorResponse } from 'src/types/utils.type';
import { Schema, schema } from 'src/utils/rules';
import { isAxiosErrorUnprocessableEntity } from 'src/utils/util';
import { useContext } from 'react';
import AppContext from 'src/context/app.context';
import Button from 'src/components/Button/Button';
import Input from 'src/components/Input';
import { path } from 'src/constant/path';

type FormData = Pick<Schema, 'password' | 'email'>;
const loginSchema = schema.pick(['password', 'email']);

export default function Login(): React.ReactNode {
  const navigate = useNavigate();
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(loginSchema) });

  const loginAccountMutation = useMutation({
    mutationFn: (body: FormData) => authApi.loginAccount(body)
  });

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (resp) => {
        setIsAuthenticated(true);
        setProfile(resp.data.data.user);
        navigate('/');
      },
      onError: (error) => {
        if (isAxiosErrorUnprocessableEntity<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data;
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'server'
              });
            });
          }
        }
      }
    });
  });

  return (
    <div className='w-full bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='rounded bg-white p-10 shadow-sm' noValidate>
              <div className='text-2xl'>Log In</div>
              <div className='mt-8'>
                <Input
                  type='email'
                  name='email'
                  //className='w-full rounded-sm border border-gray-300 p-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Email'
                  register={register}
                  errorMessage={errors.email?.message}
                />
                {/* <div className='.text-sm mt-1 min-h-[1rem] text-red-600'>{errors.email?.message}</div> */}
              </div>
              <div className='mt-3'>
                <Input
                  type='password'
                  name='password'
                  //className='w-full rounded-sm border border-gray-300 p-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Password'
                  autoComplete='on'
                  register={register}
                  errorMessage={errors.password?.message}
                />
                {/* <div className='.text-sm mt-1 min-h-[1rem] text-red-600'>{errors.password?.message}</div> */}
              </div>
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-sm uppercase text-white hover:bg-red-600'
                  isLoading={loginAccountMutation.isLoading}
                >
                  Log In
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>New to Shopee?</span>
                <Link className='ml-1 text-red-400' to={path.register}>
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
