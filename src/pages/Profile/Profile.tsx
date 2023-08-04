import Input from 'src/components/Input';

export default function Profile() {
  return (
    <div className='rounded-sm bg-white px-5 pb-20 shadow md:px-7'>
      <div className=' border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lí thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <div className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <form action='' className='mt-6 flex-grow pr-12 md:mt-0'>
          <div className='flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Email</div>
            <div className='w-[80%] pl-5'>
              <div className='pt-3 text-gray-700'>tr***********@gmail.com</div>
            </div>
          </div>
          <div className='mt-6 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Tên</div>
            <div className='w-[80%] pl-5'>
              <Input classNameInput='px-3 py-2 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm' />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Số điện thoại</div>
            <div className='w-[80%] pl-5'>
              <Input classNameInput='px-3 py-2 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm' />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Địa chỉ</div>
            <div className='w-[80%] pl-5'>
              <Input classNameInput='px-3 py-2 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm' />
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
        </form>
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
      </div>
    </div>
  );
}
