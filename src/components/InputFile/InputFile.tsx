import { useRef } from 'react';
import { toast } from 'react-toastify';
import config from 'src/constant/config';

interface Props {
  onChangeFile: (file?: File) => void;
}

export default function InputFile({ onChangeFile }: Props) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleClickInputFile = () => {
    inputFileRef.current?.click();
  };

  const handeChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = (event.target.files as FileList)[0];

    if (fileFromLocal && (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error('File size: maximum 1 MB.\nFile extension: .JPEG, .PNG');
    } else {
      onChangeFile && onChangeFile(fileFromLocal);
    }
  };

  return (
    <>
      <input
        type='file'
        className='hidden'
        accept='.jpg,.jpeg,.png'
        name='avatar'
        ref={inputFileRef}
        onClick={(event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (event.target as any).value = null;
        }}
        onChange={handeChangeInputFile}
      />
      <button
        type='button'
        className='h-10 items-center rounded-sm border bg-white px-6 text-gray-600 shadow-sm'
        onClick={handleClickInputFile}
      >
        Chọn ảnh
      </button>
    </>
  );
}
