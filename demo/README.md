## SDK 使用说明

该SDK以 openvidu 中的的 `ready-to-use-component` 为基础，做了一些修改增加了与业务相关的逻辑。

## ready-to-use component 原文档

使用文档: https://docs.openvidu.io/en/2.29.0/ready-to-use-component/
API文档: https://docs.openvidu.io/en/2.29.0/api/openvidu-angular/components/OpenviduWebComponentComponent.html

## 改动点
1. 原组件是以 openvidu-browser 进行上层开发和构建的，但是并没有导出 openvidu-browser, 导致扩展能力有限。为此增加了全局 window.OpenVidu 对象的导出，window.OpenVidu 对应于 openvidu-browser 库

openvidu-browser 使用介绍文档: https://docs.openvidu.io/en/2.29.0/cheatsheet/join-session/
openvidu-browser API 文档: https://docs.openvidu.io/en/2.29.0/api/openvidu-browser/

2. ready-to-use component 支持以旁观者模式接入会话

具体的方法为 `session.connect(token, JSON.stringify({ role: 'SUBSCRIBER' }))` , 第二个参数决定了当前是以旁观者模式接入

从旁观者模式转为参与者模式，需要先终止旁观模式，然后使用 ready-to-use component 的方式接入到会话中

3. 资源本地化

ready-to-use component 包含 JS 和 CSS 两部分，CSS 引用了谷歌字体，这里做了资源本地化

## 使用方法

可以参考此 [demo](https://43.137.12.220/demo/), 核心逻辑可 [参考代码](https://github.com/qwertyyb/openvidu-call/blob/feature/subscriber/demo/app.js)

## 注意

需要注意的是，对 sessionId 有要求，要求 sessionId 的格式为 `${床号}-{任意字符}`
