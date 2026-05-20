// ============================================================
// סקר שימוש בכלי AI — ארבעים ושתיים
// Google Apps Script backend
// ============================================================
//
// SETUP:
//   1. Open the Google Sheet → Extensions → Apps Script.
//      (This makes the script "container-bound" to the sheet —
//      so it automatically knows which spreadsheet to read/write.)
//   2. Paste this entire file.
//   3. Deploy → New deployment → Web app
//        - Execute as: Me
//        - Who has access: Anyone
//   4. Copy the deployed URL into frontend config.js → CONFIG.SCRIPT_URL.
//   5. Every time you edit this file you must redeploy:
//        Deploy → Manage deployments → ✏ edit → Version: New version → Deploy
// ============================================================

// ============================================================
// HELPERS
// ============================================================

function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet(name) {
  return getSpreadsheet().getSheetByName(name);
}

function ensureSheet(name, headers) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    Logger.log('Created sheet: ' + name);
  }
  return sheet;
}

function fmtDate(d) {
  return Utilities.formatDate(d, 'Asia/Jerusalem', 'dd/MM/yyyy');
}

function fmtTimestamp(d) {
  return Utilities.formatDate(d, 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function shortId() {
  return Utilities.getUuid().substring(0, 8);
}

// ============================================================
// RESPONSES (one row per submission)
// Schema: id(0), timestamp(1), name(2), department(3), ai_level(4),
//         paid_from_pocket(5), frustrations(6), recipe(7)
// ============================================================

const RESPONSES_HEADERS = [
  'id', 'timestamp', 'name', 'department', 'ai_level',
  'paid_from_pocket', 'frustrations', 'recipe'
];

// ============================================================
// TOOL_RESPONSES (one row per (submission × tool × category))
// Schema: response_id(0), tool_name(1), category(2), is_custom(3),
//         usage_level(4), effectiveness(5), daily_output(6)
// ============================================================
// usage_level:  'never' | 'rarely' | 'weekly' | 'daily' | 'heavy'
// effectiveness: 1..5
// daily_output: integer (0 if never / chat-only category)
// ============================================================

const TOOLRESP_HEADERS = [
  'response_id', 'tool_name', 'category', 'is_custom',
  'usage_level', 'effectiveness', 'daily_output'
];

// ============================================================
// SUBMIT SURVEY
// ============================================================
//
// Expects params:
//   name, department, ai_level       (string)
//   paid_from_pocket                 (string — free text, may be empty)
//   frustrations                     (string — free text, may be empty)
//   recipe                           (string — free text, may be empty)
//   tools                            (JSON string — array of tool objects)
//
// tools[i] = {
//   name: 'ChatGPT',
//   category: 'תמונות',
//   is_custom: false,
//   usage_level: 'daily',
//   effectiveness: 4,
//   daily_output: 30
// }
// ============================================================

function submitSurvey(data) {
  try {
    if (!data.name || !String(data.name).trim()) {
      return { success: false, message: 'שם הוא שדה חובה' };
    }
    if (!data.department || !String(data.department).trim()) {
      return { success: false, message: 'יש לבחור מחלקה' };
    }

    const responses = ensureSheet('responses', RESPONSES_HEADERS);
    const toolResp  = ensureSheet('tool_responses', TOOLRESP_HEADERS);

    const id = shortId();
    const ts = fmtTimestamp(new Date());

    responses.appendRow([
      id, ts,
      String(data.name).trim(),
      String(data.department).trim(),
      data.ai_level || '',
      data.paid_from_pocket || '',
      data.frustrations || '',
      data.recipe || ''
    ]);

    let tools = [];
    try { tools = JSON.parse(data.tools || '[]'); }
    catch (e) { tools = []; }

    tools.forEach(t => {
      if (!t || !t.name) return;
      toolResp.appendRow([
        id,
        String(t.name).trim(),
        String(t.category || '').trim(),
        t.is_custom ? 'כן' : 'לא',
        t.usage_level || 'never',
        parseInt(t.effectiveness) || 0,
        parseInt(t.daily_output) || 0
      ]);
    });

    return { success: true, message: 'הסקר נשמר. תודה!', id };
  } catch (e) {
    Logger.log('submitSurvey error: ' + e);
    return { success: false, message: e.toString() };
  }
}

// ============================================================
// DELETE RESPONSE (admin only)
// Removes the row from `responses` AND all matching rows from
// `tool_responses` by response_id. Deletes bottom-up to keep
// row indices stable during the loop.
// ============================================================

function deleteResponse(id) {
  try {
    if (!id) return { success: false, message: 'חסר id' };
    const idStr = String(id).trim();

    const respSheet = getSheet('responses');
    if (!respSheet) return { success: false, message: 'גליון responses לא נמצא' };

    let deletedResp = false;
    const respData = respSheet.getDataRange().getValues();
    for (let i = respData.length - 1; i >= 1; i--) {
      if (String(respData[i][0]).trim() === idStr) {
        respSheet.deleteRow(i + 1);
        deletedResp = true;
      }
    }

    if (!deletedResp) return { success: false, message: 'תשובה לא נמצאה' };

    // Wipe child rows from tool_responses
    let deletedTools = 0;
    const toolSheet = getSheet('tool_responses');
    if (toolSheet) {
      const toolData = toolSheet.getDataRange().getValues();
      for (let i = toolData.length - 1; i >= 1; i--) {
        if (String(toolData[i][0]).trim() === idStr) {
          toolSheet.deleteRow(i + 1);
          deletedTools++;
        }
      }
    }

    return { success: true, message: 'נמחק', deletedTools: deletedTools };
  } catch (e) {
    Logger.log('deleteResponse error: ' + e);
    return { success: false, message: e.toString() };
  }
}

// ============================================================
// ADMIN READ
// ============================================================

function getAllResponses() {
  try {
    const respSheet = ensureSheet('responses', RESPONSES_HEADERS);
    const toolSheet = ensureSheet('tool_responses', TOOLRESP_HEADERS);

    const respData = respSheet.getDataRange().getValues();
    const toolData = toolSheet.getDataRange().getValues();

    const responses = respData.slice(1).filter(r => r[0]).map(r => ({
      id: r[0],
      timestamp: r[1] instanceof Date ? fmtTimestamp(r[1]) : String(r[1]),
      name: r[2] || '',
      department: r[3] || '',
      ai_level: r[4] || '',
      paid_from_pocket: r[5] || '',
      frustrations: r[6] || '',
      recipe: r[7] || ''
    }));

    const tools = toolData.slice(1).filter(r => r[0]).map(r => ({
      response_id: r[0],
      tool_name: r[1] || '',
      category: r[2] || '',
      is_custom: r[3] === 'כן' || r[3] === true,
      usage_level: r[4] || 'never',
      effectiveness: parseInt(r[5]) || 0,
      daily_output: parseInt(r[6]) || 0
    }));

    return { success: true, responses, tools };
  } catch (e) {
    Logger.log('getAllResponses error: ' + e);
    return { success: false, message: e.toString(), responses: [], tools: [] };
  }
}

// ============================================================
// AUTH (admin only — survey form itself is public)
// ============================================================

function validateCredentials(username, password) {
  try {
    const sheet = ensureSheet('settings', ['username', 'password']);
    if (sheet.getLastRow() <= 1) {
      sheet.appendRow(['admin', 'changeme']);
    }
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(username).trim() &&
          String(data[i][1]).trim() === String(password).trim()) {
        return { success: true };
      }
    }
    return { success: false, message: 'שם משתמש או סיסמה שגויים' };
  } catch (e) {
    Logger.log('validateCredentials error: ' + e);
    return { success: false, message: e.toString() };
  }
}

// ============================================================
// MAINTENANCE
// ============================================================

function keepWarm() {
  Logger.log('keep-warm ' + new Date().toISOString());
}

// ============================================================
// HTTP ROUTER
// ============================================================

function doGet(e)  { return doPost(e); }
function doPost(e) {
  try {
    if (!e || !e.parameter) return jsonResponse({ success: false, message: 'No parameters' });
    const action = e.parameter.action;
    const p = e.parameter;

    switch (action) {

      case 'ping':
        return jsonResponse({ success: true, version: 'v3' });

      case 'submitSurvey':
        return jsonResponse(submitSurvey({
          name: p.name,
          department: p.department,
          ai_level: p.ai_level,
          paid_from_pocket: p.paid_from_pocket,
          frustrations: p.frustrations,
          recipe: p.recipe,
          tools: p.tools
        }));

      case 'getAllResponses':
        return jsonResponse(getAllResponses());

      case 'deleteResponse':
        return jsonResponse(deleteResponse(p.id));

      case 'validateCredentials':
        return jsonResponse(validateCredentials(p.username, p.password));

      default:
        return jsonResponse({ success: false, message: 'Unknown action: ' + action });
    }
  } catch (e) {
    Logger.log('doPost error: ' + e);
    return jsonResponse({ success: false, message: e.toString() });
  }
}
