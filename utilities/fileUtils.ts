import xlsx from 'xlsx';

/**
 * Utility class for file operations
 */
export class FileUtils {
  /**
   * Reads data from an Excel file and converts it to a JSON array.
   * @param {string} filePath - The path to the Excel file.
   * @returns {Promise<{ [key: string]: any }[]>} - A promise that resolves to an array of JSON objects representing the data in the Excel file.
   */
  static async readExcelFile(filePath: string): Promise<{ [key: string]: any }[]> {
    const file = xlsx.readFile(filePath);
    const data: any[] = [];
    const sheets = file.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const sheetData = xlsx.utils.sheet_to_json(file.Sheets[sheets[i]]);
      data.push(...sheetData);
    }
    return data;
  }
}
