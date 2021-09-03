import { Container, Sprite } from 'pixi.js';
import { Animal } from '../component/Animal';
import { floor } from '../utils/math';
import { DOWN, LEFT, RIGHT, UP } from './constant';
import { Dest, InitData } from '../model/types';

export function renderMap(box: Container, data: number[], col: number) {
  let tiles: string[] = ['', 'tile_road.png', 'tile_round.png', 'tile_win.png', 'tile_road.png', 'tile_road.png']
  for (let i = 0; i < data.length; i++) {
    let v = data[i]
    if (v) {
      let x = (i % col) * 80
      let y = floor(i / col) * 80
      let s = Sprite.from(tiles[v])
      s.position.set(x, y)
      box.addChild(s)
    }
  }
}

function newDest(index: number, terrain: number, target: number, direct: number): Dest {
  return { index, terrain, target, direct }
}

/**获取下一个同方向的可走位置 */
export function getNextSameDirectStep(animal: Animal, data: number[], col: number): Dest {
  let i = animal.index
  let d = animal.direct
  let result: Dest
  if (d == UP) {
    let n = i - col
    let t = data[n]
    if (n >= 0 && t) {
      result = newDest(n, t, floor(n / col) * 80 + 40, UP)
    }

  } else if (d == DOWN) {
    let n = i + col
    let t = data[n]
    if (n < data.length && t) {
      result = newDest(n, t, floor(n / col) * 80 + 40, DOWN)
    }

  } else if (d == LEFT) {
    let n = i - 1
    let t = data[n]
    if (i % col > 0 && t) {
      result = newDest(n, t, (n % col) * 80 + 40, LEFT)
    }


  } else if (d == RIGHT) {
    let n = i + 1
    let t = data[n]
    if (i % col < (col - 1) && t) {
      result = newDest(n, t, (n % col) * 80 + 40, RIGHT)
    }
  }

  return result
}

/**获取下一个反方向的可走位置 */
export function getNextDiffDirectStep(animal: Animal, data: number[], col: number): Dest {
  let i = animal.index
  let d = animal.direct
  let result: Dest
  if (d == UP) {
    let n = i + col
    let t = data[n]
    if (n < data.length && t) {
      result = newDest(n, t, floor(n / col) * 80 + 40, DOWN)
    }

  } else if (d == DOWN) {
    let n = i - col
    let t = data[n]
    if (n >= 0 && t) {
      result = newDest(n, t, floor(n / col) * 80 + 40, UP)
    }

  } else if (d == LEFT) {
    let n = i + 1
    let t = data[n]
    if (i % col < (col - 1) && t) {
      result = newDest(n, t, (n % col) * 80 + 40, RIGHT)
    }

  } else if (d == RIGHT) {
    let n = i - 1
    let t = data[n]
    if (i % col > 0 && t) {
      result = newDest(n, t, (n % col) * 80 + 40, LEFT)
    }
  }

  return result
}

/**寻找随机通路 */
export function findAllDirectDests(animal: Animal, data: number[], col: number): Dest[] {
  let i = animal.index
  let up = i - col
  let down = i + col
  let left = i - 1
  let right = i + 1
  let a: Dest[] = []
  if (up >= 0 && data[up]) {
    a.push(newDest(up, data[up], floor(up / col) * 80 + 40, UP))
  }
  if (down < data.length && data[down]) {
    a.push(newDest(down, data[down], floor(down / col) * 80 + 40, DOWN))
  }
  if (i % col > 0 && data[left]) {
    a.push(newDest(left, data[left], (left % col) * 80 + 40, LEFT))
  }
  if (i % col < (col - 1) && data[right]) {
    a.push(newDest(right, data[right], (right % col) * 80 + 40, RIGHT))
  }

  return a
}

/**
 * 寻找在视野范围内有没有老鼠，有就返回猫的方向
 */
export function findTheRat(cat: Animal, rat: Animal, data: number[], col: number): number {
  let catIndex = cat.index
  let ratIndex = rat.index
  //往上找
  let i = catIndex - col
  while (i > 0 && data[i]) {
    if (i == ratIndex) {
      return UP
    } else {
      i -= col
    }
  }
  //往下找
  i = catIndex + col
  while (i < data.length && data[i]) {
    if (i == ratIndex) {
      return DOWN
    } else {
      i += col
    }
  }
  //往左找
  let row = floor(catIndex / col)
  i = catIndex - 1
  while (floor(i / col) == row && data[i]) {
    if (i == ratIndex) {
      return LEFT
    } else {
      i -= 1
    }
  }
  //往右找
  i = catIndex + 1
  while (floor(i / col) == row && data[i]) {
    if (i == ratIndex) {
      return RIGHT
    } else {
      i++
    }
  }

  return -1
}

export function getRatAndCatsInitIndex(data: number[]): InitData {
  let result = { rat: 0, cats: [] }
  for (let i = 0; i < data.length; i++) {
    if (data[i] == 4) {
      result.rat = i
    } else if (data[i] == 5) {
      result.cats.push(i)
    }
  }
  return result
}