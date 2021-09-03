import { Point } from "pixi.js"

let { ceil, floor, round, random, abs, pow, sqrt, max, PI } = Math

/**
 * 获取指定范围内递增n的整数数组，包含开始结束数字
 * @param begin 
 * @param end 
 * @param increasing 默认1
 */
function scope(begin: number, length: number, increasing: number = 1): number[] {
  let a: number[] = []
  for (let i = 0; i < length; i++) {
    a.push(begin + i * increasing)
  }
  return a
}

/**
 * 计算两个点之间的距离
 * @param point1 
 * @param point2 
 */
function distance(point1: Point, point2: Point) {
  return abs(point1.x - point2.x) + abs(point1.y - point2.y)
}

/**补齐两位数，个位前面加0 */
function number2bit(n: number): string {
  return n > 9 ? String(n) : '0' + n
}

export { ceil, floor, round, random, abs, pow, sqrt, max, PI, scope, distance, number2bit }