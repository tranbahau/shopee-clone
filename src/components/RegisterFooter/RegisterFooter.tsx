export default function RegisterFooter() {
  return (
    <footer className='bg-neutral-100 py-8'>
      <div className='mx-auto max-w-7xl pb-4 pt-3'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <div className='lg:col-span-1'>
            <div>© 2023 Shopee. All Rights Reserved.</div>
          </div>
          <div className='flex flex-wrap lg:col-span-2'>
            <div className='pr-2 text-sm'>Country & Region:</div>
            <div className='px-2 text-sm'>Singapore</div>
            <div className='border-x px-2 text-sm'>Indonesia</div>
            <div className='border-x px-2 text-sm'>Taiwan</div>
            <div className='border-x px-2 text-sm'>Thailand</div>
            <div className='border-x px-2 text-sm'>Malaysia</div>
            <div className='border-x px-2 text-sm'>Vietnam</div>
            <div className='border-x px-2 text-sm'>Philippines</div>
            <div className='px-2 text-sm'>Chile</div>
          </div>
        </div>
        <div className='mt-10 flex justify-center text-sm lg:col-span-1'>
          <div className='px-5'>PRIVACY POLICY</div>
          <div className='border-x px-5'>TERM OF SERVICE</div>
          <div className='border-x px-5'>SHIPPING POLICY</div>
          <div className='px-5'>VIOLATION</div>
        </div>
      </div>
    </footer>
  );
}
