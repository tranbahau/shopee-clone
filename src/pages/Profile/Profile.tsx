import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import userApi from 'src/api/user.api';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import InputNumber from 'src/components/InputNumber';
import { ProfileSchema, userSchema } from 'src/utils/rules';
import { ObjectSchema } from 'yup';

type FormData = Pick<
  ProfileSchema,
  'name' | 'password' | 'new_password' | 'address' | 'confirm_password' | 'date_of_birth' | 'phone'
>;

const profileSchema = userSchema.pick([
  'name',
  'password',
  'address',
  'new_password',
  'confirm_password',
  'date_of_birth',
  'phone'
]) as ObjectSchema<FormData>;

export default function Profile() {
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  });
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      date_of_birth: new Date(1990, 0, 1),
      password: '',
      confirm_password: '',
      new_password: ''
    },
    resolver: yupResolver(profileSchema)
  });

  const profile = profileData?.data.data;
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name);
      setValue('phone', profile.phone);
      setValue('address', profile.address);
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1));
    }
  }, [profile, setValue]);

  return (
    <div className='rounded-sm bg-white px-5 pb-20 shadow md:px-7'>
      <div className=' border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lí thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form action='' className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <div className='mt-6 flex-grow pr-12 md:mt-0'>
          <div className='flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Email</div>
            <div className='w-[80%] pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Tên</div>
            <div className='w-[80%] pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='name'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Số điện thoại</div>
            <div className='w-[80%] pl-5'>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => {
                  return (
                    <InputNumber
                      classNameInput='px-3 py-2 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
                      {...field}
                      errorMessage={errors.phone?.message}
                      onChange={(event) => {
                        field.onChange(event);
                      }}
                    />
                  );
                }}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Địa chỉ</div>
            <div className='w-[80%] pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
                name='address'
                register={register}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Năm sinh</div>
            <div className='w-[80%] pl-5'>
              <div className='flex justify-between'>
                <select
                  name=''
                  id=''
                  className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange'
                >
                  <option value='' disabled>
                    Ngày
                  </option>
                </select>
                <select
                  name=''
                  id=''
                  className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange'
                >
                  <option value='' disabled>
                    Tháng
                  </option>
                </select>
                <select
                  name=''
                  id=''
                  className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange'
                >
                  <option value='' disabled>
                    Năm
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className='mt-8 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize' />
            <div className='w-[80%] pl-5'>
              <Button className='flex h-9 items-center rounded-sm bg-orange px-6 text-center text-white hover:bg-orange/90'>
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                src='https://ui-avatars.com/api/?size=128'
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <input type='file' className='hidden' accept='.jpg,.jpeg,.png' name='' id='' />
            <button className='h-10 items-center rounded-sm border bg-white px-6 text-gray-600 shadow-sm'>
              Chọn ảnh
            </button>
            <div className='mt-3 text-sm text-gray-400'>
              <div>File size: maximum 1 MB</div>
              <div>File extension: .JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
