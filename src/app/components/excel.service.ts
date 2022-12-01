import { Injectable } from '@angular/core';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  image = '';
  constructor() {
  }

  public exportAsExcelFile(json: any[], excelFileName: string, book?: any[]): void {
    debugger;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    var range = XLSX.utils.decode_range(worksheet['!ref']);
    var noRows = range.e.r; // No.of rows
    var noCols = range.e.c; // No. of cols
    /*  var wsrows =  [
       {hpt: 12}, // row 1 sets to the height of 12 in points
       {hpx: 16}, // row 2 sets to the height of 16 in pixels
     ]; wch*/
    var wscols = [];
    for (let index = 0; index <= noCols; index++) {
      wscols.push({ width: 25, vertical: 'bottom', horizontal: 'center' });
    }
    worksheet['!cols'] = wscols;

   /*  let objectMaxLength = [];
    for (let i = 0; i < json.length; i++) {
      let value = <any>Object.values(json[i]);
      for (let j = 0; j < value.length; j++) {
        if (typeof value[j] == "number") {
          objectMaxLength[j] = 10;
        } else {
          objectMaxLength[j] = objectMaxLength[j] >= value[j].length ? objectMaxLength[j] : value[j].length;
        }
      }
    }
    console.log(objectMaxLength); */
    //let cellll = worksheet.getCell('A1');
    /*  worksheet.columns.forEach(function (column) {
 
       column.width = 50;
     }); */
    /*  worksheet.forEach((element, index) => {
       worksheet.getColumn(index).width = 50;
     }); */
    /*  worksheet.eachCell((cell, index) => {
       worksheet.getColumn(index).width = 50;
     }); */
    // worksheet.getRow(1).alignment = { vertical: 'middle', wrapText: true };
    //console.log('worksheet', worksheet);
    // const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, excelFileName);
    if (book != undefined) {
      const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(book);
      var rangeD = XLSX.utils.decode_range(worksheet['!ref']);
      var noRowsD = range.e.r; // No.of rows
      var noColsD = range.e.c; // No. of cols
      var wscolsD = [];
      for (let index = 0; index <= noColsD; index++) {
        wscolsD.push({ width: 25 });
      }
      worksheet1['!cols'] = wscolsD;
      XLSX.utils.book_append_sheet(workbook, worksheet1, 'DCR raw data');
    }
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const excelBuffer: any = XLSX.writeFile(workbook, excelFileName + '.XLS', { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    // fs.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    fs.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
