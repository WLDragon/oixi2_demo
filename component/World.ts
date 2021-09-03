import { Container, Text, Ticker, Graphics, Sprite } from 'pixi.js';
import { IRouter, back } from '../utils/router';
import { OContainer, OGraphics, OSprite, OText, ox } from 'oixi2'
import { WorldMap, XWorldMap } from './WorldMap';
import { WIDTH, HEIGHT, COLOR_RED, BG_COLORS } from '../game/constant';
import { getLevelDataById, MAX_LEVEL_LENGTH } from '../levels/level';
import { WorldFail, XWorldFail } from './WorldFail';
import storage from '../game/storage';
import { Ease, tween } from '../utils/tween';
import { $t } from '../utils/i18n';

export default function () {
  return ox(new A, null, () => [
    OGraphics().beginFill(0).drawRect(0, 0, WIDTH, HEIGHT).endFill(),
    OContainer('#box', [
      OGraphics('#background @tap=onTap'),
      WorldMap('#map @over=onGameOver @win=onWin'),
      WorldFail('#fail visible=0 @replay=onReplay @watch=onWatch'),
      OSprite('#btnBack @tap=onBack y=15', 'btn_back.png'),
      OSprite('#btnLife @tap=onOpenWatchAd y=15 x=' + (WIDTH - 130), 'btn_life.png', [
        OText('#life x=75 y=14', { fill: COLOR_RED, fontSize: 40 })
      ]),
      OSprite('x=230 y=15 alpha=0.5', 'bg_label.png', [
        OText('#level x=40 y=40 anchor=0.5', { fill: 0, fontSize: 40 })
      ]),
    ]),
    OGraphics(`#curtain visible=0 x=${WIDTH / 2} y=${HEIGHT / 2}`).beginFill(0).drawCircle(0, 0, (HEIGHT / 2)).endFill()
  ])
}

class A extends Container implements IRouter {
  private background: Graphics = null
  private box: Container = null
  private map: XWorldMap = null
  private life: Text = null
  private fail: XWorldFail = null
  private curtain: Graphics = null
  private btnBack: Sprite = null
  private btnLife: Sprite = null
  private level: Text = null
  private currentLevel: number

  onBack() {
    back()
  }

  onOpenWatchAd() {

  }

  onWatch() {

  }

  onReplay() {
    this.map.replay()
    this.fail.close()
    this.start()
  }

  onWin() {
    this.stop()
    this.box.mask = this.curtain
    this.curtain.visible = true
    tween(this.curtain.scale)
      .to({ x: 0, y: 0 }, 500)
      .onComplete(() => {
        this.nextLevel()
      })
  }

  nextLevel() {
    if (this.currentLevel >= MAX_LEVEL_LENGTH) {
      this.box.mask = null
      this.curtain.visible = false
      back()
      return
    }

    this.currentLevel++
    if (storage.level < this.currentLevel) {
      storage.level = this.currentLevel
    }
    this.map.clear()

    this.createMapByLevelId(this.currentLevel)

    tween(this.curtain.scale)
      .to({ x: 1, y: 1 }, 500)
      .onComplete(() => {
        this.box.mask = null
        this.curtain.visible = false
        this.start()
      })
  }

  onGameOver() {
    this.fail.show($t('fail'), storage.life > 0)
    this.stop()
  }

  onTap() {
    this.map.changeDirect()
  }

  step() {
    this.map.run()
  }

  private start() {
    Ticker.shared.add(this.step, this)
  }

  private stop() {
    Ticker.shared.remove(this.step, this)
  }

  createMapByLevelId(id: number) {
    this.level.text = id.toString()
    let c = BG_COLORS[id % BG_COLORS.length]
    this.background.clear().beginFill(c).drawRect(0, 0, WIDTH, HEIGHT).endFill()

    let data = getLevelDataById(id)
    this.map.createMap(data)
  }

  actived(levelId: number) {
    this.btnBack.x = -85
    tween(this.btnBack).to({ x: 0 }, 300, Ease.sineOut)
    this.btnLife.x = WIDTH
    tween(this.btnLife).to({ x: WIDTH - 130 }, 300, Ease.sineOut)

    this.life.text = storage.life.toString()
    this.currentLevel = levelId
    this.createMapByLevelId(levelId)

    this.start()
  }

  deactived() {
    this.stop()
    this.fail.close()
    this.map.clear()
  }
}