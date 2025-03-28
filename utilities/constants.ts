import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Constants {
  static readonly DIFF_TOLERANCE_PERCENT: number = 0.01;
  static readonly AUTOMATION_USER_AGENT: string = 'automation';
  static readonly DATA_PATH: string = join(__dirname, '..', 'data');
}
