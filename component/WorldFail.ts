import { OContainer, OGraphics, OSprite, OText, ox } from "oixi2";
import { Container, Text, Sprite } from 'pixi.js';
import { WIDTH, HEIGHT, COLOR_WHITE, COLOR_DEEP_ORANGE } from '../game/constant';
import { Ease, tween } from "../utils/tween";
import { layout } from '../utils/layout';
import { $t } from "../utils/i18n";

export function WorldFail(attributes: string) {

  return ox(new XWorldFail, attributes, () => [
    OGraphics('interactive=1').beginFill(0, 0.5).drawRect(0, 0, WIDTH, HEIGHT).endFill(),
    OContainer(`#box pivot.x=215 pivot.y=280 x=${WIDTH / 2} y=${HEIGHT / 2}`, [
      OGraphics('y=45').beginFill(COLOR_WHITE).drawRoundedRect(0, 0, 430, 470, 10).endFill(),
      OGraphics().beginFill(COLOR_DEEP_ORANGE).drawRoundedRect(65, 0, 300, 90, 10).endFill(),
      OText('#title anchor=0.5 x=215 y=45', { fontSize: 48 }),
      OText('#tips anchor=0.5 x=215 y=180', { fill: COLOR_DEEP_ORANGE, fontSize: 24, align: 'center' }),
      layout(OSprite('#iconReplay', 'replay.png'), 430, 515).center().target,
      OSprite('@tap=onTap x=32 y=395', 'btn_replay.png', [
        OSprite('#iconAd x=20 y=20', 'video.png'),
        OText('#label anchor=0.5 x=215 y=40', { fontSize: 30 })
      ])
    ])
  ])
}

export class XWorldFail extends Container {
  box: Container = null
  title: Text = null
  tips: Text = null
  label: Text = null
  iconAd: Sprite = null
  iconReplay: Sprite = null
  enoughLife: boolean

  onTap() {
    this.emit(this.enoughLife ? 'replay' : 'watch')
  }

  show(title: string, enoughLife: boolean) {
    this.enoughLife = enoughLife
    this.title.text = title
    if (enoughLife) {
      this.tips.visible = false
      this.iconAd.visible = false
      this.iconReplay.visible = true
      this.label.text = $t('continue')
      this.label.x = 182
    } else {
      this.tips.visible = true
      this.tips.text = $t('adTips')
      this.iconAd.visible = true
      this.iconReplay.visible = false
      this.label.text = $t('watch')
      this.label.x = 215
    }

    this.box.scale.set(0)
    tween(this.box.scale).to({ x: 1, y: 1 }, 300, Ease.backOut)
    this.visible = true
  }

  close() {
    this.visible = false
  }
}