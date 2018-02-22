import * as Alexa from 'alexa-sdk'
import * as request from 'request'

export const bitriseSkill = (event: Alexa.RequestBody<any>, context: Alexa.Context) => {
  
  const appSlug = process.env.APP_SLUG
  const apiToken = process.env.API_TOKEN
  const appId = process.env.APP_ID

  const alexa = Alexa.handler(event, context)
  alexa.appId = appId
  alexa.registerHandlers({
    'Unhandled': function () {
      this.emit(':tell', 'よく分かりません。')
    },
    'LaunchRequest': function () {

        this.emit(':tell', 'こんにちは。このスキルはビットライズのビルドをスタートさせエーピーケーを配布します。')
    },
    'AMAZON.StopIntent': function () {
      this.emit(':tell', 'またご利用ください。')
    },
    'DistributeApk': function () {
      request({
        method:'post',
        url: `https://www.bitrise.io/app/${appSlug}/build/start.json`, 
        headers: {"Content-Type": "application/json; charset=utf-8"},
        json: true,
        body: {
          'hook_info': {
            'type': 'bitrise',
            'api_token': apiToken
          },
          'build_params': {
            'branch': 'master',
            'workflow_id': 'deploy',
            'commit_message': 'triggered from alexa'
          }
        }
      }, (error, response, body) => {
        let workflowId = body.triggered_workflow
        this.emit(':tell', `ワークフローアイディー${workflowId}で、ビットライズでのビルドを開始しました。ビルドが完了後、エーピーケーを配布します。`)
      })
    }
  })
  alexa.execute()
}