module.exports = {
    // Где искать исходники
    input: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.test.{js,jsx,ts,tsx}',
    ],
    // Куда складывать готовые JSON-файлы
    output: 'src/i18n/locales/$LOCALE/$NAMESPACE.json',
    locales: ['en', 'ru'],           // список языков
    namespaceSeparator: false,       // отключаем namespaces через двоеточие
    keySeparator: false,             // отключаем вложенные ключи через точку
    useKeysAsDefaultValue: true,     // берём ключ как дефолтный текст
    scanForDefaultValues: true,      // извлекаем дефолтные строки из функций t()
    verbose: true,                   // подробный вывод в консоль
    failOnWarnings: false,
    failOnErrors: true,
};