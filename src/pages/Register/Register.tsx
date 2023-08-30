import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import authApi from 'src/api/auth.api';
import Input from 'src/components/Input';
import { Schema, schema } from 'src/utils/rules';
import { omit } from 'lodash';
import { isAxiosErrorUnprocessableEntity } from 'src/utils/util';
import { ErrorResponse } from 'src/types/utils.type';
import Button from 'src/components/Button';
import AppContext from 'src/context/app.context';
import { useContext } from 'react';
import { path } from 'src/constant/path';

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>;
const registerSchema = schema.pick(['email', 'password', 'confirm_password']);

export default function Register(): React.ReactNode {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(registerSchema) });
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const navigate = useNavigate();

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  });

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password']);
    registerAccountMutation.mutate(body, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (res: any) => {
        setIsAuthenticated(true);
        setProfile(res.data.data.user);
        navigate('/');
      },
      onError: (error) => {
        if (isAxiosErrorUnprocessableEntity<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data;

          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'server'
              });
            });
          }

          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'server'
          //   });
          // }
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
              <div className='text-2xl'>Sign Up</div>
              <Input
                type='email'
                errorMessage={errors.email?.message as string}
                name='email'
                className='mt-8'
                placeholder='Email'
                register={register}
              />
              <Input
                type='password'
                errorMessage={errors.password?.message as string}
                name='password'
                className='mt-3'
                autoComplete='on'
                placeholder='Password'
                register={register}
              />
              <Input
                type='password'
                errorMessage={errors.confirm_password?.message as string}
                name='confirm_password'
                className='mt-3'
                autoComplete='on'
                placeholder='Confirm password'
                register={register}
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  isLoading={registerAccountMutation.isLoading}
                  className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-sm uppercase text-white hover:bg-red-600'
                >
                  Sign Up
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Have an account? </span>
                <Link className='ml-1 text-red-400' to={path.login}>
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
