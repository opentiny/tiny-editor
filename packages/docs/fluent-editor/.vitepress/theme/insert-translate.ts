export function insertTranslate() {
  if (typeof document === 'undefined') return
  const translateScript = document.createElement('script')
  const translateScriptStr = `
    translate.language.setLocal('chinese_simplified');
    translate.service.use('client.edge');
    translate.listener.start();
    translate.setAutoDiscriminateLocalLanguage();
    translate.selectLanguageTag.languages = 'english,chinese_simplified';
    translate.selectLanguageTag.show = false;
    translate.language.setDefaultTo('chinese_simplified');

    translate.ignore.class.push('ql-container');
    translate.ignore.class.push('ql-editor');
    translate.ignore.class.push('translate-switch');

    translate.execute();
  `
  translateScript.textContent = translateScriptStr
  document.body.append(translateScript)
}
