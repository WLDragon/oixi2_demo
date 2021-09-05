import { OContainer, OGraphics, OSprite, OText, ox } from "oixi2"
import { Container, Sprite, Texture, InteractionEvent, Text } from 'pixi.js';
import { COLOR_WHITE, HEIGHT, WIDTH } from "../game/constant"
import { Ease, tween } from "../utils/tween"
import storage from "../game/storage";
import { $t } from "../utils/i18n";

function LangButton(attributes: string, label: string, id: string) {
  return ox(new XLangButton(id), attributes, () => [
    OText('anchor=0.5 x=50 y=40', label, { fontSize: 24 })
  ])
}

class XLangButton extends Sprite {
  private _id: string

  get id(): string {
    return this._id
  }

  constructor(id: string) {
    super(Texture.from('btn_lang_a.png'))
    this.interactive = true
    this._id = id
  }

  select(selected: boolean) {
    let t = selected ? 'btn_lang_b.png' : 'btn_lang_a.png'
    this.texture = Texture.from(t)
  }
}

export function HomeSetting(attributes: string) {

  return ox(new XHomeSetting, attributes, () => [
    OGraphics('@pointertap=onClose').beginFill(0, 0.5).drawRect(0, 0, WIDTH, HEIGHT).endFill(),
    OContainer(`#box pivot.x=215 pivot.y=280 x=${WIDTH / 2} y=${HEIGHT / 2}`, [
      OGraphics().beginFill(COLOR_WHITE).drawRoundedRect(0, 0, 430, 470, 10).endFill(),
      OText('#info anchor.x=0.5 x=215 y=40', { fill: 0, fontSize: 30, align: 'center', lineHeight: 50 }),
      OContainer('x=32 y=240 @pointertap=onChangeLang', [
        LangButton('#btns', '简体', 'cn'),
        LangButton('#btns x=130', '繁体', 'tw'),
        LangButton('#btns x=260', 'English', 'en')
      ]),
      OSprite('@pointertap=onTap x=32 y=350', 'btn_replay.png', [
        OText('#labPolicy anchor=0.5 x=182 y=40', 'Privacy Policy', { fontSize: 30 })
      ])
    ])
  ])
}

export class XHomeSetting extends Container {
  box: Container = null
  btns: XLangButton[] = []
  labPolicy: Text = null
  info: Text = null

  show() {
    this.box.scale.set(0)
    tween(this.box.scale).to({ x: 1, y: 1 }, 300, Ease.backOut)
    this.visible = true
  }

  onTap() {

  }

  onClose() {
    this.visible = false
  }

  onChangeLang(e: InteractionEvent) {
    let target: XLangButton = e.target as XLangButton
    if (target.id) {
      let loc = target.id
      if (loc != storage.locale) {
        storage.locale = loc
        this.emit('lang')
      }
      this.onClose()
    }
  }

  updateLabel() {
    this.btns.forEach(b => b.select(b.id == storage.locale))
    this.labPolicy.text = $t('policy')
    this.info.text = $t('info')
  }
}