import { FileUploader as ReactFileUploader } from 'react-drag-drop-files';
import { Loading } from '~/components';

type FileUploaderProps = {
  file: ArrayBuffer | null | undefined;
  onDropFile: (file: File) => void;
  placeholder: string;
  name?: string;
};

export const FileUploader = (props: FileUploaderProps) => {
  const { file, onDropFile, placeholder, name = 'file' } = props;

  const Box = () => (
    <div className="w-full h-full flex justify-center items-center font-semibold text-xl lg:text-2xl xl:text-3xl text-gray-500 transition-colors">
      <p>
        {file && <Loading size={1.25} />} {placeholder}
      </p>
    </div>
  );

  return (
    <ReactFileUploader
      classes="w-full max-w-2xl h-screen max-h-96 border border-gray-200 bg-white rounded-md border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
      handleChange={onDropFile}
      name={name}
    >
      <Box />
    </ReactFileUploader>
  );
};
