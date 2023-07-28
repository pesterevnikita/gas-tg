function log(toLog) {
 let ss = SpreadsheetApp.getActiveSpreadsheet();
  let logSheet = ss.getSheetByName("log");
  let currentTime = new Date();
  logSheet.appendRow([currentTime, toLog]);  
}
