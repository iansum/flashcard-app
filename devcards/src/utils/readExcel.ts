import * as XLSX from "xlsx";

export type ExcelRow = {
  Front: string;
  Back: string;
};
export function readExcel(arrayBuffer: ArrayBuffer): ExcelRow[] {
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  // Get sheet name safely
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return []; // No sheets → return empty list, no error

  // Get sheet safely
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return []; // Sheet missing → also return empty list

  // Return typed rows; sheet_to_json supports a generic to cast the shape
//   return XLSX.utils.sheet_to_json(sheet) ;
  return (XLSX.utils.sheet_to_json<ExcelRow>(sheet) || []) as ExcelRow[]
}
