import { useRef } from 'react';

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

    onChangeFile && onChangeFile(fileFromLocal);
  };

  return (
    <>
      <input
        type='file'
        className='hidden'
        accept='.jpg,.jpeg,.png'
        name='avatar'
        ref={inputFileRef}
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
