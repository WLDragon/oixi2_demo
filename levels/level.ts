import { LevelData } from "../model/types";
import * as _1 from './level1_12';

let levelSet: LevelData[] = [null,
  _1.LEVEL_1,
  _1.LEVEL_2,
  _1.LEVEL_3,
  _1.LEVEL_4,
  _1.LEVEL_5,
  _1.LEVEL_6,
  _1.LEVEL_7,
  _1.LEVEL_8,
  _1.LEVEL_9,
  _1.LEVEL_10,
  _1.LEVEL_11,
  _1.LEVEL_12,
]

export const MAX_LEVEL_LENGTH: number = 12

export function getLevelDataById(id: number) {
  return levelSet[id]
}