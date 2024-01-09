
import * as express from 'express'
import { Recording } from 'openvidu-node-client'
import { UploadService, WebhookEvent } from '../services/UploadService'
import { logger } from '../utils'

export const app = express.Router({
  strict: true
})

const uploadService = new UploadService()

app.post('/', async (request, response) => {
  const { event, status } = request.body;
  if (event === WebhookEvent.recordingStatusChanged && status === Recording.Status.ready) {
    logger.info(`upload recording, request.body = ${JSON.stringify(request.body)}`)
    uploadService.upload(request.body);
  }
  return response.status(200).send('ok');
})
