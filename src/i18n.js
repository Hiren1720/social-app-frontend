import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
let lng = 'en';
if (navigator.language){
    lng = navigator.language
}

i18next
    .use(HttpApi)
    .use(initReactI18next)
    .init({
        lng,
        fallbackLng:'en',
        debug:false,
        backend:{
          loadPath:`${window.location.hash}localization/${lng}/translation.json`
        },
        interpolation:{
            escapeValue: false
        },
        react:{
            useSuspense:false
        }
});