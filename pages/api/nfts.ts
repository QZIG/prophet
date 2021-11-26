// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = string[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>): void {
    res.status(200).json(["CJu5hc24mHHBPeJCJUPurzHWHAcbPrzcEGvSJukhuKck"]);
}
