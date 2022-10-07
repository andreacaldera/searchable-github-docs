import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

const handler = (req: NextApiRequest, res: NextApiResponse<Data>): void => {
  res.status(200).json({ message: 'Healthcheck passed' });
};

export default handler;
