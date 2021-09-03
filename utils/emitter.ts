///全局消息发射器

const $once = '$once'
let messageCenter: Function[][] = []

/**
 * 监听消息
 * @param message 消息
 * @param handle 处理消息的函数
 * @returns 是否监听成功，已监听的消息再次监听返回false
 */
export function on(message: number, handle: Function): boolean {
  let handles = messageCenter[message]
  if (!handles) {
    handles = []
    messageCenter[message] = handles
  }
  //判断是否已监听，避免重复监听
  if (!handles.includes(handle)) {
    handles.push(handle)
    return true
  }

  return false
}

/**
 * 发送消息
 * @param message 消息
 * @param args 附带的参数列表
 */
export function emit(message: number, ...args: any[]) {
  let handles = messageCenter[message]
  if (handles) {
    //异步消息
    requestAnimationFrame(() => {
      handles.forEach(h => {
        h(...args)
        if (h[$once]) {
          off(message, h)
          h[$once] = false
        }
      })
    })
  } else {
    console.warn('not on message: ' + message)
  }
}

/**
 * 关闭对消息的监听
 * @param message 消息
 * @param handle 处理消息的函数
 */
export function off(message: number, handle: Function) {
  let handles = messageCenter[message]
  if (handles) {
    let i = handles.indexOf(handle)
    if (i > -1) {
      handles.splice(i, 1)
    }
  }
}

/**
 * 监听一次性消息，接收后自动关闭监听
 * @param message 消息
 * @param handle 处理消息的函数
 */
export function once(message: number, handle: Function) {
  if (on(message, handle)) {
    handle[$once] = true
  }
}