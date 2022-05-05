import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { RefObject, useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { fetchJson } from '~/helpers';
import { RecognizerData } from '~/models';
import { Loading } from '../layout';

type RecognizerUploaderProps = {
  model?: string;
  webcamRef: RefObject<Webcam>;
  placeholderUrl: string;
  onLoad?: (image: string, data: RecognizerData) => void;
  enableCapture?: boolean;
  title: string;
};

export function RecognizerUploader(props: RecognizerUploaderProps) {
  const { model, webcamRef, placeholderUrl, title, onLoad = () => null, enableCapture = true } = props;
  const [image, setImage] = useState<string | null>();
  const [data, setData] = useState<RecognizerData>();
  const [error, setError] = useState(false);
  const { t } = useTranslation('common');

  const uploadPicture = useCallback(
    async (image: string) => {
      const blob = await fetch(image).then((res) => res.blob());

      const response = await fetchJson<RecognizerData>(`/api/recognizer${model ? `?model=${model}` : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        body: blob
      });

      return response;
    },
    [model]
  );

  useEffect(() => {
    async function uploadImageOnLoaded() {
      if (!image) {
        return;
      }

      try {
        const response = await uploadPicture(image);

        setData(response);
        onLoad(image, response);
      } catch (e) {
        setImage(null);
        setError(true);
      }
    }

    uploadImageOnLoaded();
  }, [image, onLoad, uploadPicture]);

  const captureImage = useCallback(() => {
    const image = webcamRef?.current?.getScreenshot();

    setError(false);
    setImage(image);
  }, [webcamRef]);

  const PreviewImage = ({
    src,
    alt,
    extraCSS,
    size = '56'
  }: {
    src: string;
    alt: string;
    extraCSS?: string;
    size?: string;
  }) => (
    <span className={`rounded-md bg-white border border-gray-200 w-14 h-14 ${extraCSS}`}>
      <Image className={`object-cover object-center `} src={src} alt={alt} width={size} height={size} />
    </span>
  );

  const PlaceholderImage = () => PreviewImage({ src: placeholderUrl, alt: 'placeholder', extraCSS: 'p-4', size: '24' });

  return (
    <li className="flex items-center mb-2 lg:mb-10 relative">
      {image ? <PreviewImage src={image} alt="cam" /> : <PlaceholderImage />}
      <span className="mx-3 lg:mx-6">{title}</span>
      {!data && enableCapture && (
        <div className="flex flex-col ">
          <button
            type="button"
            className="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none "
            onClick={captureImage}
          >
            {image && !data && <Loading size={1.25} white />} {t('recognizer.action')}
          </button>

          {error && (
            <span className="text-red-500 text-xs absolute -bottom-5 left-1 w-screen max-w-sm ">
              {t('recognizer.error')}
            </span>
          )}
        </div>
      )}
    </li>
  );
}
