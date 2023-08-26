import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Input from 'src/components/Input';
import { ErrorResponse, NonNullUndefinedType } from 'src/types/utils.type';
import { ProfileSchema, userSchema } from 'src/utils/rules';
import { isAxiosErrorUnprocessableEntity } from 'src/utils/util';
import { ObjectSchema } from 'yup';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import userApi from 'src/api/user.api';
import { omit } from 'lodash';
import { saveProfileToLS } from 'src/utils/auth';
import { useContext } from 'react';
import AppContext from 'src/context/app.context';
import Button from 'src/components/Button';

type FormData = Pick<NonNullUndefinedType<ProfileSchema>, 'password' | 'new_password' | 'confirm_password'>;

const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password']) as ObjectSchema<FormData>;

export default function ChangePassword() {
  const { setProfile } = useContext(AppContext);
  const changePasswordMutation = useMutation(userApi.updateProfile);
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(passwordSchema)
  });

  const handleSubmitData = handleSubmit(async (data) => {
    try {
      const resp = await changePasswordMutation.mutateAsync(omit(data, ['confirm_password']));
      saveProfileToLS(resp.data.data);
      setProfile(resp.data.data);
      toast.success(resp.data.message);
      reset();
    } catch (error) {
      if (isAxiosErrorUnprocessableEntity<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData]?.toString(),
              type: 'server'
            });
          });
        }
      } else {
        toast.error('Unexpected Error !');
      }
    }
  });

  return (
    <div className='rounded-sm bg-white px-5 pb-20 shadow md:px-7'>
      <div className=' border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lí thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col' onSubmit={handleSubmitData}>
        <div className='mt-6 flex-grow pr-12 md:mt-0'>
          <div className='mt-4 flex max-w-2xl flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Mật khẩu</div>
            <div className='w-[80%] pl-5'>
              <Input
                type='password'
                className='relative'
                classNameInput='px-3 py-2 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
                name='password'
                register={register}
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
          <div className='mt-4 flex max-w-2xl flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Mật khẩu mới</div>
            <div className='w-[80%] pl-5'>
              <Input
                type='password'
                className='relative'
                classNameInput='px-3 py-2 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
                name='new_password'
                register={register}
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>
          <div className='mt-4 flex max-w-2xl  flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Xác nhận mật khẩu</div>
            <div className='w-[80%] pl-5'>
              <Input
                type='password'
                className='relative'
                classNameInput='px-3 py-2 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
                name='confirm_password'
                register={register}
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>

          <div className='mt-8 flex max-w-2xl flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize' />
            <div className='w-[80%] pl-5'>
              <Button
                type='submit'
                className='flex h-9 items-center rounded-sm bg-orange px-6 text-center text-white hover:bg-orange/90'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
