import type { UserData } from '../entities/UserData';
import type { WorkBook, WorkSheet } from 'xlsx';
import xlsx from 'xlsx';
/**
 * Utility class for file operations
 */
export class FileUtils {
  /**
   * Reads data from an Excel file and converts it to an array of UserData objects.
   * @param {string} filePath - The path to the Excel file.
   * @returns {Promise<UserData[]>} - A promise that resolves to an array of structured objects.
   */
  static async readExcelFile(filePath: string): Promise<UserData[]> {
    const file: WorkBook = xlsx.readFile(filePath);
    const data: UserData[] = [];
    const sheets: string[] = file.SheetNames;
    for (const sheet of sheets) {
      const sheetData = xlsx.utils.sheet_to_json<UserData>(file.Sheets[sheet] as WorkSheet);
      data.push(...sheetData);
    }
    return data;
  }
}
