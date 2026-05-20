/**
 * config.js — frontend configuration
 * Edit values here only. Same file is loaded by every page.
 */
const CONFIG = {

    // ── Google Apps Script web-app URL ───────────────────────
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxlWJlUyauP_s5aHB65jBLCQZvgq-QFDoItQWipjFU63JxHkvlSmECciEZLlp99omUQ3g/exec',

    // ── Direct link to the underlying Sheet (for "Open Sheet" buttons) ─
    SHEETS_URL: 'https://docs.google.com/spreadsheets/d/PASTE_SHEET_ID/edit',

    // ── App identity ─────────────────────────────────────────
    APP_NAME:     'סקר שימוש בכלי AI',
    APP_SUBTITLE: 'ארבעים ושתיים — סוכנות דיגיטל ופרסום',

    // ── Categories (in display order) ────────────────────────
    CATEGORIES: ['כתיבה וצ׳אט', 'תמונות', 'וידאו', 'סאונד', 'אחר'],

    // ── Predefined tools per category ────────────────────────
    // A tool used across categories appears in each one — the user
    // fills it out separately per category (different usage_level /
    // effectiveness / quantity per use case).
    // The 'אחר' category has no predefined tools — only customs.
    // Quantity question is hidden for 'כתיבה וצ׳אט'.
    TOOLS_BY_CATEGORY: {
        'כתיבה וצ׳אט': [
            { name: 'ChatGPT',           emoji: '💬' },
            { name: 'Claude',            emoji: '🤖' },
            { name: 'כלי ה-AI של גוגל',  emoji: '✨' },
        ],
        'תמונות': [
            { name: 'כלי ה-AI של גוגל (Flow, Gemini)', emoji: '✨' },
            { name: 'ChatGPT',                          emoji: '💬' },
            { name: 'Hedra',                            emoji: '🎬' },
        ],
        'וידאו': [
            { name: 'Kling',             emoji: '🎞️' },
            { name: 'כלי ה-AI של גוגל',  emoji: '✨' },
            { name: 'Hedra',             emoji: '🎬' },
        ],
        'סאונד': [
            { name: 'Suno',       emoji: '🎵' },
            { name: 'ElevenLabs', emoji: '🎤' },
        ],
        'אחר': [],
    },

    // Per-category placeholder text for the "add custom tool" input.
    ADD_TOOL_PLACEHOLDER: {
        'כתיבה וצ׳אט': 'הוסיפו כלי כתיבה/צ׳אט אחר...',
        'תמונות':      'הוסיפו כלי תמונות אחר...',
        'וידאו':       'הוסיפו כלי וידאו אחר...',
        'סאונד':       'הוסיפו כלי סאונד אחר...',
        'אחר':         'כלי AI אחר שמשתמשים בו...',
    },

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

    DEFAULT_THEME: 'dark',
};
