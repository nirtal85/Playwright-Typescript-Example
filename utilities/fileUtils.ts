import type { UserData } from "../entities/UserData";
import type { WorkBook, WorkSheet } from "xlsx";
import xlsx from "xlsx";

/**
 * Read an Excel file and return its rows as structured objects.
 */
export async function readExcelFile(filePath: string): Promise<UserData[]> {
	const workbook: WorkBook = xlsx.readFile(filePath);
	return workbook.SheetNames.flatMap((name) =>
		xlsx.utils.sheet_to_json<UserData>(workbook.Sheets[name] as WorkSheet),
	);
}
