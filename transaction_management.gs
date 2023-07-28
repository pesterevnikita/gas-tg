function delete_tranz(chatId, tranzId) {
  let sheetName = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(chatId);
  let range = sheetName.getDataRange();
  let values = range.getValues();
  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i][3] == tranzId) { // Column 4 (D) contains the transaction ID
      sheetName.deleteRow(i + 1); // Rows are 1-indexed, so add 1 to the index
    }
  }
}
