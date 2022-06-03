// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, MouseEvent, useState } from 'react';
import { fetchJson } from '~/helpers';
import { useUser } from '~/hooks';

export function Header() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user, mutateUser } = useUser();
  const [showLogin, setShowLogin] = useState(false);

  const links = [
    {
      url: '/recognizer',
      translation: 'header.recognizer'
    },
    {
      url: '/translation',
      translation: 'header.translation'
    },
    {
      url: '/summarization',
      translation: 'header.summarization'
    },
    {
      url: '/feedback',
      translation: 'header.feedback'
    },
    {
      url: '/generation',
      translation: 'header.generation'
    }
  ];

  const onClickLogin = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowLogin(true);
  };

  const onClickLogout = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    mutateUser(await fetchJson('/api/logout', { method: 'POST' }), false);
    router.push('/');
  };

  const onSubmitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      name: { value: string };
    };

    const body = {
      username: formElements.name.value
    };

    try {
      mutateUser(
        await fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
      );

      setShowLogin(false);
    } catch (error) {
      console.error('An unexpected error happened:', error);
    }
  };

  return (
    <header className="relative bg-white  shadow-sm">
      <div className="px-4 h-20 flex items-middle justify-between w-screen">
        <div className="flex justify-between items-center py-2  w-screen">
          <div className="flex justify-start">
            {links.map((link) => (
              <Link key={link.url} href={link.url} prefetch={false}>
                <a
                  className={`whitespace-nowrap text-base font-semibold  hover:text-primary-600 mx-4 lg:mx-6 transition-colors ${
                    router.pathname.includes(link.url) ? 'text-primary-500' : 'text-gray-400'
                  }`}
                >
                  {t(link.translation)}
                </a>
              </Link>
            ))}
          </div>

          <ul className="flex items-center justify-end flex-1">
            {!user?.isLoggedIn ? (
              <li>
                <a
                  href="#"
                  onClick={onClickLogin}
                  className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  {t('header.login')}
                </a>
              </li>
            ) : (
              <>
                <li className="absolute mt-2">
                  <a
                    href="#"
                    onClick={onClickLogout}
                    className="rounded-full border-2 hover:border-primary-500 transition-colors w-8 h-8 block mx-4 lg:mx-6"
                  >
                    <Image
                      src={user.avatarUrl}
                      width={32}
                      height={32}
                      alt={t('header.logout')}
                      className="rounded-full"
                    />
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>

        <div
          className={`transition duration-150 ease-in-out absolute top-0 right-2 ml-20  ${
            showLogin ? 'translate-y-2' : '-translate-y-full'
          }`}
        >
          <div className={`w-full bg-white rounded ${showLogin ? 'shadow-2xl' : ''}`}>
            <form onSubmit={onSubmitLogin} className="w-full max-w-xs p-4">
              <div className="mb-4">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder={t('header.github')}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  {t('header.sign_in')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
