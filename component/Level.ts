import { Container, InteractionEvent, Sprite, Text } from 'pixi.js';
import { IRouter, back, to } from '../utils/router';
import { ox, OSprite, OContainer, OText } from 'oixi2';
import { HEIGHT, WIDTH, COLOR_RED } from '../game/constant';
import { layout } from '../utils/layout';
import { ceil, floor, scope } from '../utils/math';
import { LevelItem, XLevelItem } from './LevelItem';
import { Ease, tween } from '../utils/tween';
import storage from '../game/storage';
import { MAX_LEVEL_LENGTH } from '../levels/level';

export default function () {
  return ox(new A, null, () => [
    OSprite('y=' + (HEIGHT - 285), 'bg_level.png'),
    layout(OSprite('#btnPlay @tap=onPlay', 'play.png')).centerX(3).target,
    OSprite('#btnBack @tap=onBack y=15', 'btn_back.png'),
    OSprite('#btnLife @tap=onWatch y=15 x=' + (WIDTH - 130), 'btn_life.png', [
      OText('#life x=75 y=14', { fill: COLOR_RED, fontSize: 40 })
    ]),
    layout(OContainer([
      OSprite('#btnLeft @tap=onLeft y=190 x=20', 'level_left.png'),
      OSprite('#btnRight @tap=onRight y=190 x=' + (WIDTH - 63), 'level_right.png'),
      OContainer('#items @tap=onSelectLevel x=100', scope(0, 12).map(n => {
        let x = n % 3 * 130
        let y = floor(n / 3) * 120
        return LevelItem(`x=${x} y=${y}`)
      }))
    ])).centerY(-70).target
  ])
}

class A extends Container implements IRouter {
  btnPlay: Sprite = null
  btnBack: Sprite = null
  btnLife: Sprite = null
  btnLeft: Sprite = null
  btnRight: Sprite = null
  items: Container = null
  life: Text = null

  private currentPage: number

  actived() {
    this.updateLevelList()
  }

  reactived() {
    this.updateLevelList()
  }

  updateLevelList() {
    this.life.text = storage.life.toString()

    this.btnBack.x = -85
    tween(this.btnBack).to({ x: 0 }, 300, Ease.sineOut)
    this.btnLife.x = WIDTH
    tween(this.btnLife).to({ x: WIDTH - 130 }, 300, Ease.sineOut)
    this.btnPlay.y = HEIGHT
    tween(this.btnPlay).to({ y: (HEIGHT - 260) }, 300, Ease.sineOut)

    this.currentPage = ceil(storage.level / 12)
    this.updateLevelPage()
  }

  onBack() {
    back()
  }

  onPlay() {
    to('World', storage.level)
  }

  onWatch() {

  }

  onLeft() {
    this.currentPage--
    this.updateLevelPage()
  }

  onRight() {
    this.currentPage++
    this.updateLevelPage()
  }

  onSelectLevel(e: InteractionEvent) {
    let target = e.target as XLevelItem
    if (target.id) {
      to('World', target.id)
    }
  }

  updateLevelPage() {
    let p = this.currentPage
    let e = storage.level
    this.btnLeft.visible = (p != 1)
    this.btnRight.visible = (p * 12 < MAX_LEVEL_LENGTH)

    this.items.children.forEach((m, i) => {
      let item = m as XLevelItem
      let id = (p - 1) * 12 + i + 1
      item.updateId(id, id <= e)
    })
  }

}