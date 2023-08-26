import Input from 'src/components/Input';

export default function ChangePassword() {
  return (
    <div className='rounded-sm bg-white px-5 pb-20 shadow md:px-7'>
      <div className=' border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lí thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <div className='mt-2 flex flex-wrap'>
          <div className='w-[20%] truncate pt-3 text-right capitalize'>Địa chỉ</div>
          <div className='w-[80%] pl-5'>
            <Input
              classNameInput='px-3 py-2 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
              name='address'
            />
          </div>
        </div>
        <div className='mt-2 flex flex-wrap'>
          <div className='w-[20%] truncate pt-3 text-right capitalize'>Địa chỉ</div>
          <div className='w-[80%] pl-5'>
            <Input
              classNameInput='px-3 py-2 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
              name='address'
            />
          </div>
        </div>
        <div className='mt-2 flex flex-wrap'>
          <div className='w-[20%] truncate pt-3 text-right capitalize'>Địa chỉ</div>
          <div className='w-[80%] pl-5'>
            <Input
              classNameInput='px-3 py-2 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
              name='address'
            />
          </div>
        </div>
      </form>
    </div>
  );
}
