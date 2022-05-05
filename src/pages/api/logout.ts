import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions, User } from '~/models';

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy();
  res.json({ isLoggedIn: false, login: '', avatarUrl: '' });
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
