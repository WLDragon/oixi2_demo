import { OText, ox } from "oixi2";
import { Sprite, Text, Texture } from 'pixi.js';
import { COLOR_DEEP_ORANGE } from '../game/constant';

export function LevelItem(attributes: string) {
  return ox(new XLevelItem, attributes, () => [
    OText('#label x=40 y=40 anchor=0.5', '0', { fill: COLOR_DEEP_ORANGE, fontSize: 36 })
  ])
}

export class XLevelItem extends Sprite {
  label: Text = null
  private _id: number

  constructor() {
    super(Texture.from('level_item.png'))
  }

  updateId(id: number, enable: boolean) {
    this._id = id
    this.label.text = id.toString()

    this.interactive = enable
    this.alpha = enable ? 1 : 0.5
  }

  get id(): number {
    return this._id
  }
}