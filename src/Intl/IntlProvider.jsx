import {useContext, useState} from "preact/hooks"
import {createContext} from "preact"


const INTL_CONTEXT = createContext();


function IntlProvider({children, defaultLocale, locales, messages}){

    defaultLocale = typeof window !== "undefined" ? localStorage.getItem("site__locale") ?? defaultLocale : defaultLocale;

    const [locale, setLocale] = useState(defaultLocale);

    const contextValue = {
        currentLocaleKey: locale,
        currentLocale: locales[locale],
        messages: messages ?? {},
        locales: locales,
        defaultLocale: defaultLocale,
        StateUpdater: setLocale,
    }


    return (
        <INTL_CONTEXT.Provider value = {contextValue}>
            {children}
        </INTL_CONTEXT.Provider>
    )
}


function FormatDate(date, dataOptions){
    const intlContext = useContext(INTL_CONTEXT);
    date = date ? date : new Date();
    return date.toLocaleDateString(intlContext.currentLocale, dataOptions);
}

function FormatTime(date, dataOptions){
    const intlContext = useContext(INTL_CONTEXT);
    date = date ? date : new Date();
    return date.toLocaleTimeString(intlContext.currentLocale, dataOptions);
}

function GetLocale(){
    return useContext(INTL_CONTEXT).currentLocaleKey;
}


function useLocale(){
    const intlContext = useContext(INTL_CONTEXT);

    const StateUpdater = (locale) => {
        if(intlContext?.locales[locale]){
            intlContext.StateUpdater(locale);
        }
        else{
            intlContext.StateUpdater(intlContext.defaultLocale);
        }
        if(typeof window !== 'undefined'){
            localStorage.setItem("site__locale", locale)
        }
    }


    return [intlContext.currentLocaleKey, StateUpdater];
}



function FormatMessage(id, ...args) {
    const intlContext = useContext(INTL_CONTEXT);
    const localeMessages = intlContext.messages[intlContext.currentLocaleKey] ?? {};
    const m = localeMessages[id]
    return typeof m === "function" ? m(...args) : m;
}

export {IntlProvider, FormatDate, FormatTime, FormatMessage, GetLocale, useLocale}