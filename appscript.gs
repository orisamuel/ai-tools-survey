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

// Core tool list — must match the frontend list in config.js.
// Adding a tool? Add it here AND in config.js CORE_TOOLS.
const CORE_TOOLS = ['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'Hedra', 'Kling', 'ElevenLabs', 'Suno'];

// ============================================================
// HELPERS
// ============================================================

// Uses the spreadsheet the script is container-bound to.
// As long as you opened Apps Script via Extensions → Apps Script
// from inside the sheet, this works automatically.
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

function fmtTime(d) {
  return Utilities.formatDate(d, 'Asia/Jerusalem', 'HH:mm');
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
// Schema: id(0), timestamp(1), name(2), role(3), team(4), ai_level(5),
//         paid_from_pocket(6), pain_points(7), dream_tool(8), free_text(9)
// ============================================================

const RESPONSES_HEADERS = [
  'id', 'timestamp', 'name', 'role', 'team', 'ai_level',
  'paid_from_pocket', 'pain_points', 'dream_tool', 'free_text'
];

// ============================================================
// TOOL_RESPONSES (one row per tool per submission)
// Schema: response_id(0), tool_name(1), is_custom(2),
//         usage_level(3), effectiveness(4), daily_output(5)
// ============================================================
// usage_level:  'never' | 'rarely' | 'weekly' | 'daily' | 'heavy'
// effectiveness: 1..5
// daily_output: integer (avg outputs per active day; 0 if never)
// ============================================================

const TOOLRESP_HEADERS = [
  'response_id', 'tool_name', 'is_custom',
  'usage_level', 'effectiveness', 'daily_output'
];

// ============================================================
// SUBMIT SURVEY (the only "write" the form uses)
// ============================================================
//
// Expects params:
//   name, role, team, ai_level         (string)
//   paid_from_pocket                   (string — free text, "אין"/CSV of tools)
//   pain_points                        (string — CSV)
//   dream_tool                         (string)
//   free_text                          (string)
//   tools                              (JSON string — array of tool objects)
//
// tools[i] = {
//   name: 'ChatGPT',
//   is_custom: false,
//   usage_level: 'daily',
//   effectiveness: 4,
//   daily_output: 30
// }
// ============================================================

function submitSurvey(data) {
  try {
    if (!data.name || !data.role) {
      return { success: false, message: 'שם ותפקיד הם שדות חובה' };
    }

    const responses = ensureSheet('responses', RESPONSES_HEADERS);
    const toolResp  = ensureSheet('tool_responses', TOOLRESP_HEADERS);

    const id = shortId();
    const ts = fmtTimestamp(new Date());

    responses.appendRow([
      id, ts,
      String(data.name).trim(),
      String(data.role).trim(),
      data.team || '',
      data.ai_level || '',
      data.paid_from_pocket || '',
      data.pain_points || '',
      data.dream_tool || '',
      data.free_text || ''
    ]);

    let tools = [];
    try { tools = JSON.parse(data.tools || '[]'); }
    catch (e) { tools = []; }

    tools.forEach(t => {
      if (!t || !t.name) return;
      toolResp.appendRow([
        id,
        String(t.name).trim(),
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
// ADMIN READ — returns everything the dashboard needs in one call
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
      role: r[3] || '',
      team: r[4] || '',
      ai_level: r[5] || '',
      paid_from_pocket: r[6] || '',
      pain_points: r[7] || '',
      dream_tool: r[8] || '',
      free_text: r[9] || ''
    }));

    const tools = toolData.slice(1).filter(r => r[0]).map(r => ({
      response_id: r[0],
      tool_name: r[1] || '',
      is_custom: r[2] === 'כן' || r[2] === true,
      usage_level: r[3] || 'never',
      effectiveness: parseInt(r[4]) || 0,
      daily_output: parseInt(r[5]) || 0
    }));

    return { success: true, responses, tools, core_tools: CORE_TOOLS };
  } catch (e) {
    Logger.log('getAllResponses error: ' + e);
    return { success: false, message: e.toString(), responses: [], tools: [], core_tools: CORE_TOOLS };
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
        return jsonResponse({ success: true, version: 'v1', core_tools: CORE_TOOLS });

      case 'submitSurvey':
        return jsonResponse(submitSurvey({
          name: p.name,
          role: p.role,
          team: p.team,
          ai_level: p.ai_level,
          paid_from_pocket: p.paid_from_pocket,
          pain_points: p.pain_points,
          dream_tool: p.dream_tool,
          free_text: p.free_text,
          tools: p.tools
        }));

      case 'getAllResponses':
        return jsonResponse(getAllResponses());

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
