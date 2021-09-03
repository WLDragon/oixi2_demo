import { Sprite, Texture, Container, Graphics } from 'pixi.js';
import { DOWN, LEFT, UP, RIGHT } from '../game/constant';
import { Dest } from '../model/types';
import { floor } from '../utils/math';
import { ITween, tween } from '../utils/tween';

export class Animal extends Container {
  private runSpeed: number
  private rotateSpeed: number
  private target: number
  private pauseRound: boolean
  private _terrain: number
  private _runing: boolean
  private _index: number
  private _originDirect: number
  private skin: Sprite
  private shadow: Graphics
  private skinCount: number = 0
  private skinResource: string
  private isSkin1: boolean = true
  private tweenAngle: ITween
  private tweenHit: ITween
  /**移到方向 */
  direct: number
  /**猫在转弯处预定的下一个目标位置 */
  prepareDest: Dest

  constructor(skinResource: string, runSpeed: number, rotateSpeed: number) {
    super()

    this.shadow = new Graphics()
    this.shadow.beginFill(0, 0.3).drawCircle(6, 6, 30).endFill()
    this.addChild(this.shadow)

    this.skin = new Sprite()
    this.skin.pivot.set(40)
    this.addChild(this.skin)

    this.runSpeed = runSpeed
    this.rotateSpeed = rotateSpeed
    this.changeSkin(skinResource)
  }

  reset(index: number, column: number) {

    let x = (index % column) * 80 + 40
    let y = floor(index / column) * 80 + 40
    this.position.set(x, y)

    this._index = index
    this.direct = UP
    this._terrain = 1
    this._runing = false
    this.pauseRound = false
    this.prepareDest = null

    this.skin.angle = 0

    this.changeToSkin1()
  }

  changeSkin(skinskinResource: string) {
    this.skinResource = skinskinResource
    this.skin.texture = Texture.from(skinskinResource + '_1.png')
  }

  runTo(dest: Dest) {
    this._runing = true
    this._index = dest.index
    this.direct = dest.direct
    this.target = dest.target
    this._terrain = dest.terrain

    //防止夹角太大转圈太多
    let directAngle = this.direct * 90
    if (this.skin.angle - directAngle > 180) {
      this.skin.angle -= 360
    }

    if (this.tweenAngle) { this.tweenAngle.destory() }
    this.tweenAngle = tween(this.skin).to({ angle: directAngle }, 300)
  }

  chooseDirect() {
    this._originDirect = this.direct
    if (this.skin.angle > 315 || this.skin.angle <= 45) {
      this.direct = UP
    } else if (this.skin.angle > 45 && this.skin.angle <= 135) {
      this.direct = RIGHT
    } else if (this.skin.angle > 135 && this.skin.angle <= 225) {
      this.direct = DOWN
    } else if (this.skin.angle > 225 && this.skin.angle <= 315) {
      this.direct = LEFT
    }
  }

  hitTheWall() {
    if (this.pauseRound) { return }

    this.pauseRound = true
    let ot: number, t1: number, t2: number, prop: string
    if (this.direct == UP) {
      ot = this.y
      t1 = ot + 20
      t2 = ot - 20
      prop = 'y'
    } else if (this.direct == DOWN) {
      ot = this.y
      t1 = ot - 20
      t2 = ot + 20
      prop = 'y'
    } else if (this.direct == LEFT) {
      ot = this.x
      t1 = ot + 20
      t2 = ot - 20
      prop = 'x'
    } else if (this.direct == RIGHT) {
      ot = this.x
      t1 = ot - 20
      t2 = ot + 20
      prop = 'x'
    }
    if (this.tweenHit) { this.tweenHit.destory() }
    this.tweenHit = tween(this.position)
      .to({ [prop]: t1 }, 50)
      .to({ [prop]: t2 }, 80)
      .to({ [prop]: ot }, 50)
      .onComplete(() => this.pauseRound = false)
  }

  goRound(): boolean {
    if (this.pauseRound) { return true }
    if (this._terrain == 2 && !this.runing) {
      this.skin.angle += this.rotateSpeed
      if (this.skin.angle >= 360) {
        this.skin.angle = 0
      }

      if (!this.isSkin1) {
        this.changeToSkin1()
      }
      return true
    }
    return false
  }

  run() {
    if (this.direct == UP) {
      if (this.y > this.target) {
        this.y -= this.runSpeed
      } else {
        this._runing = false
      }

    } else if (this.direct == DOWN) {
      if (this.y < this.target) {
        this.y += this.runSpeed
      } else {
        this._runing = false
      }

    } else if (this.direct == LEFT) {
      if (this.x > this.target) {
        this.x -= this.runSpeed
      } else {
        this._runing = false
      }

    } else if (this.direct == RIGHT) {
      if (this.x < this.target) {
        this.x += this.runSpeed
      } else {
        this._runing = false
      }
    }
  }

  playMovice() {
    this.skinCount++
    if (this.isSkin1) {
      if (this.skinCount > 12) {
        //切换到跳起动作
        this.changeToSkin2()
      }
    } else {
      if (this.skinCount > 12) {
        //切换到下地动作
        this.changeToSkin1()
      }
    }
  }

  private changeToSkin1() {
    this.skinCount = 0
    this.isSkin1 = true
    this.skin.texture = Texture.from(this.skinResource + '_1.png')

    this.skin.scale.set(1)
    this.shadow.scale.set(1)
  }

  private changeToSkin2() {
    this.skinCount = 0
    this.isSkin1 = false
    this.skin.texture = Texture.from(this.skinResource + '_2.png')

    this.skin.scale.set(1.06)
    this.shadow.scale.set(0.98)
  }

  release() {
    if (this.tweenHit) { this.tweenHit.destory() }
    if (this.tweenAngle) { this.tweenAngle.destory() }
    this.destroy({ children: true })
  }

  get terrain(): number {
    return this._terrain
  }

  get runing(): boolean {
    return this._runing
  }

  get index(): number {
    return this._index
  }

  get originDirect(): number {
    return this._originDirect
  }

  get skinAngle(): number {
    return this.skin.angle
  }
}