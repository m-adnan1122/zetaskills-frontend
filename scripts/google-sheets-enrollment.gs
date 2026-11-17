// Set WEBHOOK_SECRET and SPREADSHEET_ID in Script Properties.
function doPost(e) {
  const reply = (ok, code) => ContentService.createTextOutput(JSON.stringify({ ok, code })).setMimeType(ContentService.MimeType.JSON);
  let input;
  try { input = JSON.parse(e.postData.contents); } catch (_) { return reply(false, "INVALID_REQUEST"); }
  const secret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
  if (!secret || !input || input.secret !== secret || !/^[0-9a-f-]{36}$/i.test(input.id || "")) return reply(false, "AUTH_OR_REQUEST_INVALID");
  const lock = LockService.getScriptLock();
  let stage = "LOCK_FAILED";
  try {
    lock.waitLock(25000);
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
    if (!spreadsheetId) return reply(false, "SPREADSHEET_ID_MISSING");
    stage = "SPREADSHEET_ACCESS_FAILED";
    const book = SpreadsheetApp.openById(spreadsheetId);
    const sheet = book.getSheetByName("Enrollments") || book.insertSheet("Enrollments");
    stage = "SHEET_WRITE_FAILED";
    const headers = ["ID", "Submitted at", "Full name", "Father's name", "Phone", "WhatsApp", "Email", "CNIC/B-Form", "Date of birth", "Qualification", "Institution", "Course", "Batch", "Referral source", "Laptop", "Goal", "Referred by", "WhatsApp same as phone", "Confirmed"];
    if (sheet.getLastRow() === 0) sheet.appendRow(headers);
    else {
      const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
      if (headers.some((header, i) => current[i] && current[i] !== header)) return reply(false, "HEADER_MISMATCH");
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    if (sheet.getLastRow() > 1 && sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).createTextFinder(input.id).matchEntireCell(true).findNext()) return reply(true);
    const fields = ["id", "createdAt", "fullName", "fatherName", "phoneNumber", "whatsappNumber", "emailAddress", "cnic", "dateOfBirth", "lastQualification", "institutionName", "courseSlug", "batchTime", "referralSource", "laptop", "goal", "referredBy", "sameAsPhone", "confirmed"];
    // All cells are plain text, including telephone numbers and CNICs.
    const values = fields.map((field) => String(input[field] == null ? "" : input[field]));
    const range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, values.length);
    range.setNumberFormat("@");
    range.setValues([values.map((value) => /^[=+\-@\t\r]/.test(value) ? "'" + value : value)]);
    SpreadsheetApp.flush();
    return reply(true);
  } catch (_) { return reply(false, stage); }
  finally { if (lock.hasLock()) lock.releaseLock(); }
}
