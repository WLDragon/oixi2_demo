import { setTextDefaultStyle } from 'oixi2'
import { Application, utils } from 'pixi.js'
import { setLayoutSize } from './utils/layout'
import { initRouter, to } from './utils/router'
import { settings } from 'pixi.js'

import Home from './component/Home'
import Level from './component/Level'
import World from './component/World'

import { HEIGHT, WIDTH, COLOR_LIGHT_ORANGE } from './game/constant';
import storage from './game/storage'

import { debugLoadImages } from './_assist/imageDebug'
import { initI18n } from './utils/i18n';
import i18nConfig from './game/i18nConfig'

utils.skipHello()

//严格模式，只能使用缓存，不能使用全路径
settings.STRICT_TEXTURE_CACHE = true

setTextDefaultStyle({ fill: 0xffffff, fontSize: 36, fontFamily: ['sans-serif'] })
setLayoutSize(WIDTH, HEIGHT)

window.onload = function () {
  initI18n(i18nConfig)
  storage.init()

  let application = new Application({
    width: WIDTH,
    height: HEIGHT,
    sharedLoader: true,
    sharedTicker: true,
    backgroundColor: COLOR_LIGHT_ORANGE,
    resolution: window.devicePixelRatio || 1
  })

  //适配ipad，两边留白
  let w = window.innerWidth
  let h = window.innerHeight
  if (w / h > 0.6) {
    application.view.style.width = h * (WIDTH / HEIGHT) + 'px'
    application.view.style.height = h + 'px';
  } else {
    application.view.style.width = w + 'px';
    application.view.style.height = h + 'px';
  }


  //配置路由
  initRouter(application.stage, { Home, Level, World })

  application.loader.baseUrl = './assets/'

  if (process.env.NODE_ENV == 'development') {
    debugLoadImages(application)
  } else {
    application.loader.add(['sprites.json', 'tile_road.png', 'tile_round.png', 'tile_win.png'])
  }

  application.loader.load(() => {
    to('Home')
  })

  document.body.appendChild(application.view)
}
