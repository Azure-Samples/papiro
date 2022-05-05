import { NextApiRequest } from 'next';

export function ensureSession(req: NextApiRequest) {
  if (!req?.session?.user) {
    throw { message: 'Unauthorized', statusCode: 401 };
  }
}
