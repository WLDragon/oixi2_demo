import { setI18nLocale } from '../utils/i18n';
function getItem(key: string): string {
  return localStorage.getItem(key)
}

function setItem(key: string, value: string) {
  localStorage.setItem(key, value)
}

class DataStorage {
  private _level: number
  private _life: number
  private _locale: string

  init() {
    this._level = Number(getItem('level') || 1)
    this._life = Number(getItem('life') || 3)
    this._locale = getItem('locale')

    if (!this._locale) {
      //判断语言环境
      let loc: string
      let nglg = navigator.language
      if (nglg == 'zh-CN') {
        loc = 'cn'
      } else if (nglg.indexOf('zh') == 0) {
        loc = 'tw'
      } else {
        loc = 'en'
      }
      this.locale = loc
    } else {
      setI18nLocale(this._locale)
    }
  }

  set level(v: number) {
    this._level = v
    setItem('level', v.toString())
  }

  /**当前可以挑战的最大关卡 */
  get level(): number {
    return this._level
  }

  set life(v: number) {
    this._life = v
    setItem('life', v.toString())
  }

  /**可以挑战关卡的次数 */
  get life(): number {
    return this._life
  }

  set locale(v: string) {
    this._locale = v
    setI18nLocale(v)
    setItem('locale', v)
  }

  /**多语言 */
  get locale(): string {
    return this._locale
  }
}

export default new DataStorage