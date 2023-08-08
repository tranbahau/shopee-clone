import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import userApi from 'src/api/user.api';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import InputNumber from 'src/components/InputNumber';
import { ProfileSchema, userSchema } from 'src/utils/rules';
import { ObjectSchema } from 'yup';
import DatePicker from '../User/components/DatePicker';
import AppContext from 'src/context/app.context';
import { saveProfileToLS } from 'src/utils/auth';
import InputFile from 'src/components/InputFile';
import { getURLImage, isAxiosErrorUnprocessableEntity } from 'src/utils/util';
import { ErrorResponse } from 'src/types/utils.type';
import { toast } from 'react-toastify';

type FormData = Pick<ProfileSchema, 'name' | 'address' | 'date_of_birth' | 'phone' | 'avatar'>;

const profileSchema = userSchema.pick([
  'name',
  'address',
  'date_of_birth',
  'phone',
  'avatar'
]) as ObjectSchema<FormData>;

export default function Profile() {
  const { setProfile } = useContext(AppContext);
  const [file, setFile] = useState<File>();
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : '';
  }, [file]);

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  });
  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  });
  const profileMutation = useMutation(userApi.updateProfile);
  const uploadAvatarMutation = useMutation(userApi.uploadAvatar);

  const profile = profileData?.data.data;
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name);
      setValue('phone', profile.phone);
      setValue('address', profile.address);
      setValue('avatar', profile.avatar);
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1));
    }
  }, [profile, setValue]);

  const avatar = watch('avatar');
  const handleSubmitData = handleSubmit(async (data) => {
    try {
      let avatarName = avatar;
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const uploadedFile = await uploadAvatarMutation.mutateAsync(formData);
        setValue('avatar', uploadedFile.data.data);

        avatarName = uploadedFile.data.data;
      }

      const resp = await profileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      });

      saveProfileToLS(resp.data.data);
      setProfile(resp.data.data);
      await refetch();
      toast.success(resp.data.message);
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

  const onChangeFile = (file?: File) => {
    if (file) {
      setFile(file);
    }
  };

  return (
    <div className='rounded-sm bg-white px-5 pb-20 shadow md:px-7'>
      <div className=' border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lí thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={handleSubmitData}>
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
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} errorMessage={errors.date_of_birth?.message} />
            )}
          />

          <div className='mt-8 flex flex-wrap'>
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
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                src={previewImage || getURLImage(avatar)}
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <InputFile onChangeFile={onChangeFile} />
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
