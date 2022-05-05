import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Router from 'next/router';
import { useEffect } from 'react';
import { Layout, Loading } from '~/components';
import { useUser } from '~/hooks';

const Home: NextPage = () => {
  const { t } = useTranslation('common');
  const { user } = useUser();

  useEffect(() => {
    function redirectIfLoggedIn() {
      if (!user?.isLoggedIn) {
        return;
      }

      Router.push('/recognizer');
    }

    redirectIfLoggedIn();
  }, [user]);

  return (
    <Layout>
      <div className="w-full text-center py-5 font-bold">
        {user?.isLoggedIn ? (
          <Loading size={1.25}>
            <span className="mx-2">{t('shared.loading')}</span>
          </Loading>
        ) : (
          <div>{t('home.please_login')}</div>
        )}
      </div>
    </Layout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common']))
  }
});

export default Home;
