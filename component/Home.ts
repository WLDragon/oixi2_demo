import { Container, Sprite, Texture } from 'pixi.js';
import { IRouter, to } from '../utils/router';
import { OSprite, ox } from 'oixi2'
import { layout } from '../utils/layout';
import { HEIGHT, WIDTH } from '../game/constant';
import { Ease, tween } from '../utils/tween';
import { HomeSetting, XHomeSetting } from './HomeSetting';
import storage from '../game/storage';

export default function () {
  return ox(new A, null, () => [
    OSprite('y=' + (HEIGHT - 662), 'bg_home.png'),
    layout(OSprite('#btnPlay @tap=onLevelList', 'play.png')).bottom(127).centerX(3).target,
    OSprite('#title y=150'),
    OSprite('#btnSetting x=460 y=15 @tap=onSetting', 'btn_setting.png'),
    HomeSetting('#setting visible=0 @lang=onChangeLang')
  ]).created()
}

class A extends Container implements IRouter {
  btnPlay: Sprite = null
  btnSetting: Sprite = null
  setting: XHomeSetting = null
  title: Sprite = null

  created() {
    this.onChangeLang()
    return this
  }

  onChangeLang() {
    this.setting.updateLabel()

    let tt = storage.locale == 'en' ? 'title_en.png' : 'title_cn.png'
    this.title.texture = Texture.from(tt)
  }

  onSetting() {
    this.setting.show()
  }

  onLevelList() {
    to('Level')
  }

  reactived() {
    this.btnPlay.y = HEIGHT
    tween(this.btnPlay).to({ y: (HEIGHT - 332) }, 300, Ease.sineOut)

    this.btnSetting.x = WIDTH
    tween(this.btnSetting).to({ x: 460 }, 300, Ease.sineOut)
  }
}