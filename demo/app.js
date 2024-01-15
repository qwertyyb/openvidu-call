const fetchToken = async (args = {}) => {
  const body = JSON.stringify({
    sessionId: 'daily-call',
    ...args,
  })
  const response = await fetch("/web-call/api/v1/sessions", {
    "body": body,
    "method": "POST",
    "headers": {
      "content-type": "application/json"
    },
    "credentials": "include"
  });
  const json = await response.json();
  return json.cameraToken
}

const formatOptions = options => {
  if (!options.sessionId) {
    throw new Error('sessionId is required');
  }
  if (!/^\d+-.+/.test(options.sessionId)) {
    throw new Error('sessionId must starts with bed number, eg: 3-foo, 4-bar')
  }

  let container = options.container
  if (typeof container === 'string') {
    container = document.querySelector(container)
  }
  if (!container) {
    throw new Error(`container ${container} not found`)
  }
  return {
    ...options,
    container
  }
}

class WebCallViewer {
  sessionId = null;
  container = null;

  session = null;

  static checkSessionId = (sessionId) => {
    const match = /^\d+-.+/.test(sessionId)
    if (!match) {
      throw new Error('sessionId must starts with bed number, eg: 3-foo, 4-bar')
    }
    return match
  }

  constructor(options = { sessionId: '', container: '' }) {
    const { sessionId, container } = formatOptions(options);

    this.sessionId = sessionId
    this.container = container
  }

  async watch() {
    this.container.innerHTML = '<div class="web-call-prepare" style="text-align:center">加载中</div>'
    const token = await fetchToken({ sessionId: this.sessionId, role: 'SUBSCRIBER' });
    const OV = new OpenVidu();
    const session = OV.initSession();
    this.session = session;

    session.on('streamCreated', (event) => {
      console.warn('STREAM CREATED!');
      console.warn(event.stream);
      const subscriber = session.subscribe(event.stream, this.container, {
        insertMode: 'PREPEND'
      });
      subscriber.on('videoElementCreated', () => {
        const prepare = this.container.querySelector('.web-call-prepare')
        if (prepare) {
          prepare.parentNode.removeChild(prepare)
        }
        let joinBtn = this.container.querySelector('.web-call-join-btn')
        if (!joinBtn) {
          const viewer = document.createElement('div')
          viewer.classList.add('web-call-viewer-toolbar')
          viewer.innerHTML = `<button class="web-call-leave-btn">关闭</button><button class="web-call-join-btn">加入会话</button>`
          this.container.appendChild(viewer)
          viewer.querySelector('.web-call-join-btn').addEventListener('click', () => {
            this.join()
          })
          viewer.querySelector('.web-call-leave-btn').addEventListener('click', () => {
            this.destroy()
          })
        }
      })
      subscriber.on('videoElementDestroyed', () => {
        const isAllRemoved = this.container.querySelectorAll('video').length <= 0
        if (isAllRemoved) {
          const toolbar = this.container.querySelector('.web-call-viewer-toolbar')
          if (toolbar) {
            toolbar.parentNode.removeChild(toolbar)
          }
        }
      })
    });


    // 3) Connect to the session
    return session.connect(token, JSON.stringify({ role: 'SUBSCRIBER' }))
      .then(() => {
        console.log('connect success');
      }).catch(error => {
        console.log('There was an error connecting to the session:', error.code, error.message);
      });
  }

  destroy() {
    if (this.session) {
      this.session.off('streamCreated')
      this.session.off('streamDestroyed')
      this.session.off('connectionCreated')
      this.session.off('connectionDestryed')
      this.session.disconnect()
      this.session = null
    }
  }

  join() {
    this.destroy()
    const participant = new WebCallParticipant({ sessionId: this.sessionId, container: this.container })
    participant.join()
    return participant
  }
}

class WebCallParticipant {
  container = null;
  sessionId = null;

  session = null;

  static checkSessionId = (sessionId) => {
    const match = /^\d+-.+/.test(sessionId)
    if (!match) {
      throw new Error('sessionId must starts with bed number, eg: 3-foo, 4-bar')
    }
    return match
  }

  constructor(options = { sessionId: '', container: '' }) {
    const { sessionId, container } = formatOptions(options);

    this.sessionId = sessionId
    this.container = container
  }
  async join() {
    const token = await fetchToken({ sessionId: this.sessionId });

    let ovComp = document.querySelector('openvidu-webcomponent')
    if (!ovComp) {
      ovComp = document.createElement('openvidu-webcomponent');
      ovComp.prejoin = false
      ovComp.minimal = true
      ovComp.lang = 'cn'
    
      this.container.appendChild(ovComp);
    }

    ovComp.tokens = token;
    ovComp.addEventListener('onSessionCreated', (event) => {
      const session = event.detail
      if (session) {
        session.on('sessionDisconnected', (event) => {
          ovComp.parentNode.removeChild(ovComp)
        })
      }
    })
  }

  destroy() {
    if (this.container) {
      this.container.querySelectorAll('openvidu-webcomponent').forEach(dom => dom.disconnect())
      this.container.innerHTML = ''
      this.container = null
    }
  }
}

class WebCall {
  static createViewer = (options) => new WebCallViewer(options)

  static createParticipant = (options) => new WebCallParticipant(options)
}
