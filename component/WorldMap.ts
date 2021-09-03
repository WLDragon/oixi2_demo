import { Container } from 'pixi.js';
import { OContainer, ox } from 'oixi2'
import { LevelData, InitData, Dest } from '../model/types';
import { floor, abs, random } from '../utils/math';
import { Animal } from './Animal';
import { renderMap, getNextDiffDirectStep, getNextSameDirectStep, findTheRat, findAllDirectDests, getRatAndCatsInitIndex } from '../game/logic';
import { WIDTH, HEIGHT } from '../game/constant';
import { Ease, tween } from '../utils/tween';

export function WorldMap(attributes: string) {
  return ox(new XWorldMap, attributes, () => [
    OContainer('#box'),
    OContainer('#boxAnimal')
  ]).created()
}

export class XWorldMap extends Container {
  private box: Container = null
  private boxAnimal: Container = null

  private rat: Animal
  private cats: Animal[] = []

  private column: number
  private levelData: LevelData
  private initData: InitData

  created() {
    this.position.set(floor(WIDTH / 2), floor(HEIGHT / 2))
    return this
  }

  rotateMap(animal: Animal) {
    let d = animal.direct - animal.originDirect
    let a: number = -1
    if (d == -1 || d == 3) {
      a = this.angle + 45
    } else if (d == 1 || d == -3) {
      a = this.angle - 45
    }

    if (a != -1) {
      tween(this).to({ angle: a }, 600, Ease.sineOut).onComplete(() => {
        if (a == 360 || a == -360) {
          this.angle = 0
        }
      })
    }
  }

  replay() {
    this.angle = 0
    this.rat.reset(this.initData.rat, this.column)
    this.initData.cats.forEach((p, i) => {
      let cat = this.cats[i]
      cat.reset(p, this.column)
    })
  }

  /**
   * 创建地图
   */
  createMap(levelData: LevelData) {
    this.angle = 0

    this.levelData = levelData

    let data = levelData.data
    let col = levelData.column
    this.column = col
    this.initData = getRatAndCatsInitIndex(data)

    renderMap(this.box, data, col)

    this.rat = new Animal('rat', 6, 6)
    this.rat.reset(this.initData.rat, this.column)

    this.initData.cats.forEach(c => {
      let cat = new Animal('cat', 4, 6)
      cat.reset(c, this.column)
      this.cats.push(cat)
    })

    this.boxAnimal.addChild(this.rat)
    this.cats.forEach(c => {
      this.boxAnimal.addChild(c)
    })

    this.pivot.set(this.rat.x, this.rat.y)
  }

  changeDirect() {
    if (this.rat.runing) {
      let dest = getNextDiffDirectStep(this.rat, this.levelData.data, this.column)
      if (dest) {
        this.rat.runTo(dest)
      }
    } else {
      this.rat.chooseDirect()
      let dest = getNextSameDirectStep(this.rat, this.levelData.data, this.column)
      if (dest) {
        this.rotateMap(this.rat)
        this.rat.runTo(dest)
      } else {
        this.rat.hitTheWall()
      }
    }
  }

  checkIsGameOver(): boolean {
    let rat = this.rat
    for (let i = 0; i < this.cats.length; i++) {
      let c = this.cats[i]
      let dx = abs(c.x - rat.x)
      let dy = abs(c.y - rat.y)
      if (dx < 60 && dy < 60) {
        return true
      }
    }
    return false
  }

  run() {
    if (this.checkIsGameOver()) {
      this.emit('over')
      return
    }

    let rat = this.rat
    let cats = this.cats
    let data = this.levelData.data
    let column = this.column

    //老鼠行为，在路口会打转
    if (!rat.goRound()) {
      if (!rat.runing) {
        if (rat.terrain == 3) {
          this.emit('win')
          return
        }

        let dest = getNextSameDirectStep(rat, data, column)
        if (!dest) {
          dest = getNextDiffDirectStep(rat, data, column)
        }
        if (dest) {
          rat.runTo(dest)
        }
      }
      //rat.runTo会设置runing为true，所以这里要重新判断，不是和上面的判断混为一谈
      if (rat.runing) {
        rat.run()
      }
      rat.playMovice()
    }

    //猫行为，在能看到老鼠的直线上会追着老鼠，否则会在路口随机转向
    cats.forEach(cat => {
      if (!cat.runing) {
        let ratDirect = findTheRat(cat, rat, data, column)
        //如果在路口发现老鼠，且原来的预设方向和老鼠的方向不一致，则需要重新寻路
        let t = cat.prepareDest && (ratDirect == -1 || cat.prepareDest.direct == ratDirect)
        if (t) {
          //在路口要顺时针转到预设方向
          cat.goRound()
          let g = cat.skinAngle >= 330 ? (360 - cat.skinAngle) : cat.skinAngle
          let dg = abs(g - cat.prepareDest.direct * 90)
          if (dg < 45) {
            cat.runTo(cat.prepareDest)
            cat.prepareDest = null
          }

        } else {
          if (cat.terrain == 2) {
            let allDest = findAllDirectDests(cat, data, column)
            let dest: Dest
            for (let i = 0; i < allDest.length; i++) {
              if (allDest[i].direct == ratDirect) {
                dest = allDest[i]
                break
              }
            }
            if (!dest) {
              dest = allDest[floor(random() * allDest.length)]
            }
            cat.prepareDest = dest

          } else if (ratDirect != -1) {
            cat.direct = ratDirect
          }
        }
      }

      if (!cat.prepareDest && !cat.runing) {
        //配置地图时猫的初始位置上或下一定要有通路
        let dest = getNextSameDirectStep(cat, data, column)
        if (!dest) {
          dest = getNextDiffDirectStep(cat, data, column)
        }
        cat.runTo(dest)
      }

      cat.playMovice()
      cat.run()
    })

    this.pivot.set(rat.x, rat.y)
  }

  clear() {
    this.box.removeChildren().forEach(c => c.destroy())
    this.boxAnimal.removeChildren().forEach(c => (c as Animal).release())
    this.rat = null
    this.cats = []
  }

}