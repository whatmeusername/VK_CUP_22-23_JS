
const COLOR_THEMES = [
	{
		color: "#4A352F",
		appliedClass: "theme__color__brown theme__color__sidebar__light"
	},
	{
		color: "#424242",
		appliedClass: "theme__color__dark theme__color__sidebar__light"
	},
	{
		color: "#5A355A",
		appliedClass: "theme__color__violet theme__color__sidebar__light"
	},
	{
		color: "#35385A",
		appliedClass: "theme__color__darkblue theme__color__sidebar__light"
	},
	{
		color: "#646ECB",
		appliedClass: "theme__color__bluepink theme__color__sidebar__light"
	},
	{
		color: "#E73672",
		appliedClass: "theme__color__pink theme__color__sidebar__light"
	},
	{
		color: "#F44336",
		appliedClass: "theme__color__orange theme__color__sidebar__light"
	},
	{
		color: "#388E3C",
		appliedClass: "theme__color__green theme__color__sidebar__light"
	},
	{
		color: "#81D8D0",
		appliedClass: "theme__color__cyan theme__color__sidebar__dark"
	},
	{
		color: "#E2DCD2",
		appliedClass: "theme__color__gray theme__color__sidebar__dark"
	},
	{
		color: "#FFEBCD",
		appliedClass: "theme__color__pastel theme__color__sidebar__dark"
	},
	{
		color: "#E7EED2",
		appliedClass: "theme__color__pastelgreen theme__color__sidebar__dark"
	},
	{
		color: "#D0F0F7",
		appliedClass: "theme__color__lightblue theme__color__sidebar__dark"
	},
	{
		color: "#C9D0FB",
		appliedClass: "theme__color__lightpink theme__color__sidebar__dark"
	},
	{
		color: "#DDF3FF",
		appliedClass: "theme__color__pastellightblue theme__color__sidebar__dark"
	},
	{
		color: "#F0F0F0",
		appliedClass: "theme__color__white theme__color__sidebar__dark"
	},

];

const CUSTOM_THEMES = [
	{
		bgImage: "custom_theme_dark.png",
		localKey: "SETTINGS_CT_DARK",
		appliedClass: "custom_theme_dark",
        prefix: "dark",
	},
	{
		bgImage: "custom_theme_light.png",
		localKey: "SETTINGS_CT_LIGHT",
		appliedClass: "custom_theme_light",
        prefix: "light",
	},
	{
		bgImage: "custom_theme_anime.png",
		localKey: "SETTINGS_CT_ANIME",
		appliedClass: "custom_theme_anime",
        prefix: "other",
		background: (url) => `linear-gradient(180deg, rgba(117, 0, 69, 0.64) 0%, rgba(0, 9, 83, 0.64) 100%), url("${url}/static/anime_bg.png"), #FFFFFF`
	}
];

const LANGUAGES = [
	{
		icon: "en.svg",
		label: "English",
		localeKey: "ENGLISH",
	},
	{
		icon: "ru.svg",
		label: "Русский",
		localeKey: "RUSSIAN",
	}
];


const FOLDERS = [
	{localeKey: "SIDEBAR_FG_MAIL", icon: "mail", slug: "mail", isDefault: true,}, 
	{localeKey: "SIDEBAR_FG_IMPORTANT", icon: "folder", slug: "important"}, 
	{localeKey: "SIDEBAR_FG_SEND", icon: "send", slug: "send"},
	{localeKey: "SIDEBAR_FG_DRAFTS", icon: "list", slug: "drafts"},
	{localeKey: "SIDEBAR_FG_ARCHIVE", icon: "archive", slug: "archive"},
	{localeKey: "SIDEBAR_FG_SPAM", icon: "spam", slug: "spam"},
	{localeKey: "SIDEBAR_FG_DELETED", icon: "bucket", slug: "deleted"}
]

const SORTING_ITEMS = [
	{
		localeKey: "SORTING_NEW",
		slug: "date_desc",
		isDefault: true
	},
	{
		localeKey: "SORTING_OLD",
		slug: "date_asc"
	},
	{
		localeKey: "SORTING_AUTHOR_DESC",
		slug: "author_desc"
	},
	{
		localeKey: "SORTING_AUTHOR_ASC",
		slug: "author_asc"
	},
	{
		localeKey: "SORTING_SUBJECT_DESC",
		slug: "subject_desc"
	},
	{
		localeKey: "SORTING_SUBJECT_ASC",
		slug: "subject_asc"
	},
]
const F_PREFIX = "filter_"

export {COLOR_THEMES, CUSTOM_THEMES, LANGUAGES, FOLDERS, SORTING_ITEMS, F_PREFIX}