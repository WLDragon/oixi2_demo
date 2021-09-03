import { Application } from "pixi.js";


let assets: string = 'bg_home.png,bg_label.png,bg_level.png,btn_back.png,btn_lang_a.png,btn_lang_b.png,btn_life.png,btn_replay.png,btn_setting.png,cat_1.png,cat_2.png,level_item.png,level_left.png,level_right.png,play.png,rat_1.png,rat_2.png,replay.png,tile_road.png,tile_round.png,tile_win.png,title_cn.png,title_en.png,video.png';

/**
 * 这个文件使用 npm run image 生成，不要修改
 */
export function debugLoadImages(application: Application) {
  let a = assets.split(',')
  let b = application.loader
  a.forEach(path => {
    let name = path.includes('heads/') ? path.substring(6) : path
    b.add(name, '../_assist/images/' + path)
  })
}