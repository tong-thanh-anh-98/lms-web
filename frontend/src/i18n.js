import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// cấu hình để tạo file dịch từ frontend
i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        supportedLngs: ['vi', 'en'],
        fallbackLng: 'en',
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage']
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },
        react: {
            useSuspense: false,
        },
    });

// cấu hình để tạo file dịch từ backend
// i18n
//     .use(HttpApi)
//     .use(LanguageDetector)
//     .use(initReactI18next)
//     .init({
//         supportedLngs: ['vi', 'en'],
//         fallbackLng: 'vi',
//         detection: {
//             order: ['localStorage', 'navigator', 'htmlTag'],
//             caches: ['localStorage']
//         },
//         backend: {
//             loadPath: 'http://localhost:8000/api/translations/{{lng}}',
//         },
//         react: {
//             useSuspense: true,
//         },
//         // debug: true // Bật debug để xem log trên console
//     });

export default i18n;
