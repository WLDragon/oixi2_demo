
import { floor } from "../utils/math"

///540 * [960] 的设计稿
let w = window.innerWidth
let h = window.innerHeight
let sw = 540
let sh: number
if (w / h > 0.6) {
  sh = 960
} else {
  sh = floor(h / w * sw)
}
/**屏幕宽度 */
export const WIDTH: number = sw
/**屏幕高度 */
export const HEIGHT: number = sh

/**方向，上 */
export const UP: number = 0
/**方向，右 */
export const RIGHT: number = 1
/**方向，下 */
export const DOWN: number = 2
/**方向，左 */
export const LEFT: number = 3

/**浅橙色 */
export const COLOR_LIGHT_ORANGE: number = 0xffb74d
/**深橙色 */
export const COLOR_DEEP_ORANGE: number = 0xf57c00
/**红色 */
export const COLOR_RED: number = 0xff4200
/**白色 */
export const COLOR_WHITE: number = 0xffffff

/**地图背题颜色 */
export const BG_COLORS: number[] = [0x827717, 0xef6c00, 0x558b2f, 0x0288d1, 0x673ab7, 0xe53935, 0x9c27b0, 0x1e88e5, 0x546e7a, 0x3949ab, 0xd81b60, 0x795548]