import { ServerResponse } from 'http';

export const handleErrors = (
  res: ServerResponse,
  code: number,
  message: string
) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message }));
};
