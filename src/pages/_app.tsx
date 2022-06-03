// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { appWithTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { fetchJson } from '~/helpers';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        }
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common']))
  }
});

export default appWithTranslation(MyApp);
