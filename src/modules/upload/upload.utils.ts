import { extname } from 'path';

export function customFileName(originalname: string): string {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return uniqueSuffix + extname(originalname);
}
