import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const DIFF_TOLERANCE_PERCENT = 0.01;
export const AUTOMATION_USER_AGENT = "automation";
export const DATA_PATH = join(__dirname, "../../resources");
