
interface IEase {
  (t: number): number
}

/**
 * 缓函数枚举，更多参考 https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
 */
const Ease = {
  linear: function (t: number) {
    return t
  },
  backIn: function (t: number) {
    return t * t * ((1.7 + 1) * t - 1.7)
  },
  backOut: function (t: number) {
    return (--t * t * ((1.7 + 1) * t + 1.7) + 1)
  },
  sineIn: function (t: number) {
    return 1 - Math.cos(t * Math.PI / 2)
  },
  sineOut: function (t: number) {
    return Math.sin(t * Math.PI / 2)
  }
}

class TweenItem {
  props: { [x in string] }
  duration: number
  ease: IEase

  propsOriginValue: { [x in string] }
  start: number = 0

  constructor(props: Object, duration: number, ease: IEase) {
    this.props = props
    this.duration = duration
    this.ease = ease
  }
}

interface ITween {
  /**
   * 指定属性缓动到目标值
   * @param props 目标属性
   * @param duration 执行时长，毫秒
   * @param ease 缓动函数
   */
  to(props: Object, duration?: number, ease?: IEase): ITween
  /**
   * 等待一段时间再执行
   * @param duration 时长，毫秒
   */
  wait(duration: number): ITween
  /**缓动结束后执行的方法 */
  onComplete(call: Function): ITween
  /**缓动过程回调函数 */
  onChange(call: Function): ITween
  /**停止并主动销毁Tween */
  destory(): void
}

class TweenObject implements ITween {
  target: any
  isLoop: boolean
  isKeep: boolean
  index: number = 0
  complete: Function
  change: Function
  tweenItems: TweenItem[] = []
  isComplete: boolean = false

  constructor(target: any, loop: boolean, keep: boolean) {
    this.target = target
    this.isLoop = loop
    this.isKeep = keep
  }

  to(props: Object, duration: number = 0, ease: IEase = Ease.linear) {
    this.tweenItems.push(new TweenItem(props, duration, ease))
    return this
  }

  wait(duration: number) {
    this.tweenItems.push(new TweenItem(null, duration, null))
    return this
  }

  onComplete(call: Function) {
    this.complete = call
    return this
  }

  onChange(call: Function) {
    this.change = call
    return this
  }

  destory() {
    this.isLoop = false
    this.isComplete = true
    this.complete = null
    this.change = null
    this.tweenItems = null
  }
}

let tweening: TweenObject[] = []

/**
 * 移除所有的动画
 */
function removeAllTween() {
  for (let i = 0; i < tweening.length; i++) {
    let tobj = tweening[i]
    tobj.destory()
  }
}

/**
 * 简易动画补间工具
 * @param target 应用的目标对象
 * @param loop 是否无限循环
 * @param keep 是否保持引用，主动destory才会释放内存
 */
function tween(target: any, loop: boolean = false, keep: boolean = false): ITween {
  if (loop && keep) {
    throw Error('cannot be set \'loop\' and \'keep\' to true at the same time')
  }
  let t = new TweenObject(target, loop, keep)
  tweening.push(t)
  return t
}

// Basic lerp funtion.
function lerp(a1: number, a2: number, t: number) {
  return a1 * (1 - t) + a2 * t;
}

/**帧循环 */
function tick() {
  if (tweening.length) {
    let remove: TweenObject[] = []
    let now = Date.now()

    for (let i = 0; i < tweening.length; i++) {
      let tobj = tweening[i]

      if (!tobj.isLoop && tobj.isComplete) {
        remove.push(tobj)

      } else if (tobj.tweenItems.length) {
        let titem = tobj.tweenItems[tobj.index]

        if (titem.start == 0) {
          titem.start = now
          //初始化原始值，如果使用wait方法props为null
          if (titem.props) {
            titem.propsOriginValue = {}
            for (let k in titem.props) {
              titem.propsOriginValue[k] = tobj.target[k]
            }
          }
        }

        //执行缓动过程
        const phase = Math.min(1, (now - titem.start) / titem.duration)
        if (titem.props) {
          for (let k in titem.props) {
            tobj.target[k] = lerp(titem.propsOriginValue[k], titem.props[k], titem.ease(phase))
          }
          if (tobj.change) {
            tobj.change()
          }
        }

        //缓动结束
        if (phase === 1) {
          tobj.index++
          if (tobj.index >= tobj.tweenItems.length) {

            if (tobj.isLoop) {
              tobj.index = 0
              tobj.tweenItems.forEach(m => m.start = 0)

            } else if (tobj.isKeep) {
              tobj.index = 0
              tobj.tweenItems.length = 0
            }

            if (tobj.complete) {
              tobj.complete()
            }

            if (!tobj.isLoop && !tobj.isKeep) {
              tobj.destory()
            }
          }
        }
      }
    }

    //移除缓动结束的tween
    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1)
    }
  }

  window.requestAnimationFrame(tick)
}

window.requestAnimationFrame(tick)

export { tween, Ease, removeAllTween, ITween }