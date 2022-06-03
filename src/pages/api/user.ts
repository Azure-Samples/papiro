// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions, User } from '~/models';

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      ...req.session.user,
      isLoggedIn: true
    });
  } else {
    res.json({
      isLoggedIn: false,
      login: '',
      avatarUrl: ''
    });
  }
}

export default withIronSessionApiRoute(userRoute, sessionOptions);
