type LangData = { cn: string, en: string, tw: string }

let i18nLocale = 'cn'
let i18nConfig: { [x in string]: LangData } = {}

export function initI18n(config: { [x in string]: LangData }) {
  i18nConfig = config
}

export function setI18nLocale(locale: string) {
  i18nLocale = locale
}

export function getI18nLocale(): string {
  return i18nLocale
}

export function $t(key: string, ...rest: string[]): string {
  let row: LangData = i18nConfig[key]
  if (!row) {
    console.error('no lang key: ' + key)
    return ''
  }

  let result: string = row[i18nLocale].replace(/\\n/g, '\n')

  if (rest.length) {
    //使用参数替换字符串中的{n}模板
    for (let i = 0; i < rest.length; i++) {
      result = result.replace('{' + i + '}', rest[i])
    }
  }

  return result
}
