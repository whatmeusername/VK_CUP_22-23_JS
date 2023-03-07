import { WordDeclination } from "./utils"

const MESSAGES = {
    RUSSIAN: {
        ATTACHMENT_DOWNLOAD: "Скачать",

        SIDEBAR_NEW_MESSAGE: "Написать письмо",
        SIDEBAR_FG_MAIL: "Входящие",
        SIDEBAR_FG_IMPORTANT: "Важное",
        SIDEBAR_FG_SEND: "Отправленные",
        SIDEBAR_FG_DRAFTS: "Черновики",
        SIDEBAR_FG_ARCHIVE: "Архив",
        SIDEBAR_FG_SPAM: "Спам",
        SIDEBAR_FG_DELETED: "Корзина",
        SIDEBAR_FG_NEW_FOLDER: "Новая папка",
        SIDEBAR_SETTINGS: "Настройки",

        HEADER_FILTER_LABEL: "Фильтр",
        HEADER_FILTER_UNREAD: "Непрочитанные",
        HEADER_FILTER_FLAGGED: "С флажком",
        HEADER_FILTER_ATTACHMENT: "С вложениями",
        HEADER_FILTER_ALL: "Все письма",
        HEADER_FILTER_RESET: "Сбросить все",

        SORTING_LABEL: "Сортировка",
        SORTING_NEW: "Сначала новые",
        SORTING_OLD: "Сначала старые",
        SORTING_AUTHOR_DESC: "Автор: от А до Я",
        SORTING_AUTHOR_ASC: "Автор: от Я до А",
        SORTING_SUBJECT_DESC: "Тема: от А до Я",
        SORTING_SUBJECT_ASC: "Тема: от Я до А",


        LETTERS: (n) => WordDeclination(n, ["письмо", "письма", "письм"]),

        LP_CLIENT: "Вы",
        LP_TO_LESS: "Кому",
        LP_TO_MANY: (n) => WordDeclination(n, ["получатель", "получателя", "получателей"]),
        LP_FILES: (n) => WordDeclination(n, ["файл", "файла", "файлов"]),
        LP_FILE_DOWNLOAD: "Скачать",
        LP_FILE_DOWNLOAD_MANY: "Скачать все файлы",
        LP_OTHERS: "еще",
        LP_TODAY: "Сегодня",

        SETTINGS_SIDEBAR_THEME: "Внешний вид",
        SETTINGS_SIDEBAR_THEME_LABEL: "Настройки внешнего вида вашей почты и темы оформления",
        SETTINGS_SIDEBAR_LANGUAGE_LABEL: "Изменить язык",
        SETTINGS_SIDEBAR_LANGUAGE_BTN: "Выбрать язык",
        SETTINGS_SIDEBAR_LANGUAGE: "Язык",


        SETTINGS_CT_DARK: "Темная тема",
        SETTINGS_CT_LIGHT: "Светлая тема",
        SETTINGS_CT_ANIME: "Аниме",

        LL_NOT_FOUND: "Писeм нет",


        WL_TO: "Кому",
        WL_THEME: "Тема",
        WL_CC: "Копия",
        WL_BCC: "Скрытая",
        WL_OPEN_CC: "Копии",

        WL_ATTACHMENT_FILE: "Прикрепить файл",
        WL_ATTACHMENT_CLOUD: "Из облака",
        WL_ATTACHMENT_MAIL: "Из почты",
        WL_ATTACHMENT_DELETE: "удалить все",
        WL_TEXTAREA_PLACEHOLDER: "Напишите здесь что-нибудь",

        WL_DND_LABEL: "Отпустите файлы здесь, чтобы прекрепить его к письму",

        WL_F_SEND: "Отправить",
        WL_F_SAVE: "Сохранить",
        WL_F_CLOSE: "Закрыть",

        CM_NEW_TAB: "Открыть в новой вкладке",
        CM_DELETE: "Удалить",
        CM_ARCHIVE: "В архив",
        CM_SPAM: "Спам",
        CM_MOVE_TO: "Переместить в папку",
        CM_READ: "Отметить прочитанным",
        CM_UNREAD: "Отметить непрочитанным",
        CM_FLAG: "Отметить флажком",
        CM_UNFLAG: "Снять флажок",

    },
    ENGLISH: {
        ATTACHMENT_DOWNLOAD: "Download",


        SIDEBAR_NEW_MESSAGE: "Compose",
        SIDEBAR_FG_MAIL: "Inbox",
        SIDEBAR_FG_IMPORTANT: "Important",
        SIDEBAR_FG_SEND: "Sent",
        SIDEBAR_FG_DRAFTS: "Drafts",
        SIDEBAR_FG_ARCHIVE: "Archive",
        SIDEBAR_FG_SPAM: "Spam",
        SIDEBAR_FG_DELETED: "Trash",
        SIDEBAR_FG_NEW_FOLDER: "New folder",
        SIDEBAR_SETTINGS: "Settings",


        HEADER_FILTER_LABEL: "Filter",
        HEADER_FILTER_UNREAD: "Unread",
        HEADER_FILTER_FLAGGED: "Flagged",
        HEADER_FILTER_ATTACHMENT: "With attachments",
        HEADER_FILTER_ALL: "All messages",
        HEADER_FILTER_RESET: "Reset all",

        SORTING_LABEL: "Sorting",
        SORTING_NEW: "Newest on top",
        SORTING_OLD: "Oldest on top",
        SORTING_AUTHOR_DESC: "Sender: A to Z",
        SORTING_AUTHOR_ASC: "Sender: Z to A",
        SORTING_SUBJECT_DESC: "Subject: A to Z",
        SORTING_SUBJECT_ASC: "Subject: Z to A",

        LETTERS: (n) => WordDeclination(n, ["letter", "letters", "letters"]),

        LP_CLIENT: "You",
        LP_TO_LESS: "To",
        LP_TO_MANY: (n) => WordDeclination(n, ["recipient", "recipients", "recipients"]),
        LP_FILES: (n) => WordDeclination(n, ["file", "files", "files"]),
        LP_FILE_DOWNLOAD: "Download",
        LP_FILE_DOWNLOAD_MANY: "Download all files",
        LP_OTHERS: "other",
        LP_TODAY: "Today",


        SETTINGS_SIDEBAR_THEME: "Interface",
        SETTINGS_SIDEBAR_THEME_LABEL: "Customize the appearance and design theme of your email",
        SETTINGS_SIDEBAR_LANGUAGE_LABEL: "Switch Language",
        SETTINGS_SIDEBAR_LANGUAGE_BTN: "Switch",
        SETTINGS_SIDEBAR_LANGUAGE: "Language",

        SETTINGS_CT_DARK: "Dark theme",
        SETTINGS_CT_LIGHT: "Light theme",
        SETTINGS_CT_ANIME: "Anime",
        
        LL_NOT_FOUND: "No messages",

        WL_TO: "To",
        WL_THEME: "Subject",
        WL_CC: "CC",
        WL_BCC: "BCC",
        WL_OPEN_CC: "СC, BCC",

        WL_ATTACHMENT_FILE: "Attach file",
        WL_ATTACHMENT_CLOUD: "From cloud",
        WL_ATTACHMENT_MAIL: "From mail",
        WL_ATTACHMENT_DELETE: "Delete all",
        WL_TEXTAREA_PLACEHOLDER: "Write something here",

        WL_DND_LABEL: "Release the files here to attach it to the email",

        WL_F_SEND: "Send",
        WL_F_SAVE: "Save",
        WL_F_CLOSE: "Close",


        CM_NEW_TAB: "Open in new tab",
        CM_DELETE: "Delete",
        CM_ARCHIVE: "To archive",
        CM_SPAM: "Spam",
        CM_MOVE_TO: "Move to",
        CM_READ: "Mark as read",
        CM_UNREAD: "Mark as unread",
        CM_FLAG: "Flag",
        CM_UNFLAG: "Unflag",
    }
}

export {MESSAGES}