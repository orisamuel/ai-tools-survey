/**
 * config.js — frontend configuration
 * Edit values here only. Same file is loaded by every page.
 */
const CONFIG = {

    // ── Google Apps Script web-app URL ───────────────────────
    // Paste the URL from: Apps Script editor → Deploy → Manage deployments
    SCRIPT_URL: 'PASTE_YOUR_DEPLOYED_SCRIPT_URL_HERE',

    // ── Direct link to the underlying Sheet (for "Open Sheet" buttons) ─
    SHEETS_URL: 'https://docs.google.com/spreadsheets/d/PASTE_SHEET_ID/edit',

    // ── App identity ─────────────────────────────────────────
    APP_NAME:     'סקר שימוש בכלי AI',
    APP_SUBTITLE: 'ארבעים ושתיים — סוכנות דיגיטל ופרסום',

    // ── Tool categories (order = display order in survey) ────
    CATEGORIES: ['כתיבה וצ׳אט', 'תמונות', 'וידאו', 'סאונד'],

    // ── Core tools ───────────────────────────────────────────
    // categories[0] determines which section the tool appears under.
    // Tools whose ONLY category is 'כתיבה וצ׳אט' skip the quantity question.
    // Must match CORE_TOOLS in appscript.gs.
    CORE_TOOLS: [
        { name: 'ChatGPT',           categories: ['כתיבה וצ׳אט', 'תמונות'],            emoji: '💬' },
        { name: 'Claude',            categories: ['כתיבה וצ׳אט'],                       emoji: '🤖' },
        { name: 'כלי ה-AI של גוגל',  categories: ['כתיבה וצ׳אט', 'תמונות', 'וידאו'],   emoji: '✨' },
        { name: 'Midjourney',        categories: ['תמונות'],                            emoji: '🎨' },
        { name: 'Hedra',             categories: ['וידאו'],                             emoji: '🎬' },
        { name: 'Kling',             categories: ['וידאו'],                             emoji: '🎞️' },
        { name: 'ElevenLabs',        categories: ['סאונד'],                             emoji: '🎤' },
        { name: 'Suno',              categories: ['סאונד'],                             emoji: '🎵' },
    ],

    USAGE_LEVELS: [
        { value: 'never',  label: 'לא משתמש/ת' },
        { value: 'rarely', label: 'נדיר — פחות מפעם בשבוע' },
        { value: 'weekly', label: 'שבועי — מספר פעמים בשבוע' },
        { value: 'daily',  label: 'יומי — כמעט כל יום' },
        { value: 'heavy',  label: 'כבד — כל היום, כל הזמן' },
    ],

    EFFECTIVENESS_LABELS: {
        1: 'חלש מאוד',
        2: 'בסדר, יש יותר טובים',
        3: 'עושה את העבודה',
        4: 'טוב מאוד',
        5: 'אי אפשר בלי',
    },

    DEPARTMENTS: [
        'קריאייטיב',
        'וידאו',
        'ניהול לקוח',
        'סטודיו',
        'הנהלה בכירה',
        'מחלקת מדיה ותוכן',
    ],

    AI_LEVELS: [
        'מתחיל/ה — שמעתי על זה',
        'בסיסי — משתמש/ת בכלי-שניים',
        'מתקדם/ת — חי/ה את זה יומיום',
        'אקספרט/ית — מלמד/ת אחרים',
    ],

    // ── Theme ────────────────────────────────────────────────
    DEFAULT_THEME: 'dark',
};
