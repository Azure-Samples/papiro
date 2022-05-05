import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect } from 'react';
import { useUser } from '~/hooks';
import { Header } from './Header';

export function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('common');
  const { user } = useUser();

  useEffect(() => {
    function redirectIfotLoggedAndNotInHome() {
      const { pathname } = Router;

      if (!user || user?.isLoggedIn || pathname === '/') {
        return;
      }

      Router.push('/');
    }

    redirectIfotLoggedAndNotInHome();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>{t('meta.title')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex flex-col grow justify-center">{children}</main>
    </div>
  );
}
