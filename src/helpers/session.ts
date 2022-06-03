// Copyright 2022 (c) Microsoft Corporation.
// Licensed under the MIT license.
import { NextApiRequest } from 'next';

export function ensureSession(req: NextApiRequest) {
  if (!req?.session?.user) {
    throw { message: 'Unauthorized', statusCode: 401 };
  }
}
