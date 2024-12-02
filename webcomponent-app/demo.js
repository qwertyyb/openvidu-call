import monkeyPatchMediaDevices from './utils/media-devices.js';

var MINIMAL;
var LANG;
var CAPTIONS_LANG;
var CUSTOM_LANG_OPTIONS;
var CUSTOM_CAPTIONS_LANG_OPTIONS;
var PREJOIN;
var VIDEO_MUTED;
var AUDIO_MUTED;

var SCREENSHARE_BUTTON;
var FULLSCREEN_BUTTON;
var ACTIVITIES_PANEL_BUTTON;
var RECORDING_BUTTON;
var BROADCASTING_BUTTON;
var CHAT_PANEL_BUTTON;
var DISPLAY_LOGO;
var LOCAL_STREAM_VISIBLE;
var DISPLAY_SESSION_NAME;
var DISPLAY_PARTICIPANT_NAME;
var DISPLAY_AUDIO_DETECTION;
var SETTINGS_BUTTON;
var LEAVE_BUTTON;
var PARTICIPANT_MUTE_BUTTON;
var PARTICIPANTS_PANEL_BUTTON;
var ACTIVITIES_RECORDING_ACTIVITY;
var ACTIVITIES_BROADCASTING_ACTIVITY;
var RECORDING_ERROR;
var BROADCASTING_ERROR;
var TOOLBAR_SETTINGS_BUTTON;
var CAPTIONS_BUTTON;

var SINGLE_TOKEN;
var SESSION_NAME;
var FAKE_DEVICES;

var PARTICIPANT_NAME;
var PARTICIPANT_MODE;

var OPENVIDU_SERVER_URL;
var OPENVIDU_SECRET;

$(document).ready(() => {
	var url = new URL(window.location.href);

	OPENVIDU_SERVER_URL = url.searchParams.get('OV_URL');
	OPENVIDU_SECRET = url.searchParams.get('OV_SECRET');

	SINGLE_TOKEN = url.searchParams.get('singleToken') === null ? false : url.searchParams.get('singleToken') === 'true';

	FAKE_DEVICES = url.searchParams.get('fakeDevices') === null ? false : url.searchParams.get('fakeDevices') === 'true';

	// Directives
	MINIMAL = url.searchParams.get('minimal') === null ? false : url.searchParams.get('minimal') === 'true';
	LANG = url.searchParams.get('lang') || 'en';
	CAPTIONS_LANG = url.searchParams.get('captionsLang') || 'en-US';
	CUSTOM_LANG_OPTIONS =
	url.searchParams.get('langOptions') === null ? false : url.searchParams.get('langOptions') === 'true';
	CUSTOM_CAPTIONS_LANG_OPTIONS =
		url.searchParams.get('captionsLangOptions') === null ? false : url.searchParams.get('captionsLangOptions') === 'true';
	PARTICIPANT_NAME = url.searchParams.get('participantName') || 'TEST_USER';
	PARTICIPANT_MODE = url.searchParams.get('participantMode') || 'PARTICIPANT'
	LOCAL_STREAM_VISIBLE = url.searchParams.get('localStreamVisible') !== 'false';
	PREJOIN = url.searchParams.get('prejoin') === null ? true : url.searchParams.get('prejoin') === 'true';
	VIDEO_MUTED = url.searchParams.get('videoMuted') === null ? false : url.searchParams.get('videoMuted') === 'true';
	AUDIO_MUTED = url.searchParams.get('audioMuted') === null ? false : url.searchParams.get('audioMuted') === 'true';
	SCREENSHARE_BUTTON = url.searchParams.get('screenshareBtn') === null ? true : url.searchParams.get('screenshareBtn') === 'true';
	RECORDING_BUTTON =
		url.searchParams.get('toolbarRecordingButton') === null ? true : url.searchParams.get('toolbarRecordingButton') === 'true';
	FULLSCREEN_BUTTON = url.searchParams.get('fullscreenBtn') === null ? true : url.searchParams.get('fullscreenBtn') === 'true';
	BROADCASTING_BUTTON =
		url.searchParams.get('toolbarBroadcastingButton') === null ? true : url.searchParams.get('toolbarBroadcastingButton') === 'true';

	if (url.searchParams.get('broadcastingError') !== null) {
		BROADCASTING_ERROR = url.searchParams.get('broadcastingError');
	}

	TOOLBAR_SETTINGS_BUTTON =
		url.searchParams.get('toolbarSettingsBtn') === null ? true : url.searchParams.get('toolbarSettingsBtn') === 'true';
	CAPTIONS_BUTTON = url.searchParams.get('toolbarCaptionsBtn') === null ? true : url.searchParams.get('toolbarCaptionsBtn') === 'true';

	LEAVE_BUTTON = url.searchParams.get('leaveBtn') === null ? true : url.searchParams.get('leaveBtn') === 'true';
	ACTIVITIES_PANEL_BUTTON =
		url.searchParams.get('activitiesPanelBtn') === null ? true : url.searchParams.get('activitiesPanelBtn') === 'true';
	CHAT_PANEL_BUTTON = url.searchParams.get('chatPanelBtn') === null ? true : url.searchParams.get('chatPanelBtn') === 'true';
	PARTICIPANTS_PANEL_BUTTON =
		url.searchParams.get('participantsPanelBtn') === null ? true : url.searchParams.get('participantsPanelBtn') === 'true';
	ACTIVITIES_BROADCASTING_ACTIVITY =
		url.searchParams.get('activitiesPanelBroadcastingActivity') === null
			? true
			: url.searchParams.get('activitiesPanelBroadcastingActivity') === 'true';
	ACTIVITIES_RECORDING_ACTIVITY =
		url.searchParams.get('activitiesPanelRecordingActivity') === null
			? true
			: url.searchParams.get('activitiesPanelRecordingActivity') === 'true';
	if (url.searchParams.get('recordingError') !== null) {
		RECORDING_ERROR = url.searchParams.get('recordingError');
	}

	DISPLAY_LOGO = url.searchParams.get('displayLogo') === null ? true : url.searchParams.get('displayLogo') === 'true';
	DISPLAY_SESSION_NAME =
		url.searchParams.get('displaySessionName') === null ? true : url.searchParams.get('displaySessionName') === 'true';
	DISPLAY_PARTICIPANT_NAME =
		url.searchParams.get('displayParticipantName') === null ? true : url.searchParams.get('displayParticipantName') === 'true';
	DISPLAY_AUDIO_DETECTION =
		url.searchParams.get('displayAudioDetection') === null ? true : url.searchParams.get('displayAudioDetection') === 'true';
	SETTINGS_BUTTON = url.searchParams.get('settingsBtn') === null ? true : url.searchParams.get('settingsBtn') === 'true';
	PARTICIPANT_MUTE_BUTTON =
		url.searchParams.get('participantMuteBtn') === null ? true : url.searchParams.get('participantMuteBtn') === 'true';

	SESSION_NAME =
		url.searchParams.get('sessionName') === null ? `E2ESession${Math.floor(Date.now())}` : url.searchParams.get('sessionName');

	var webComponent = document.querySelector('openvidu-webcomponent');

	webComponent.addEventListener('onJoinButtonClicked', (event) => appendElement('onJoinButtonClicked'));
	webComponent.addEventListener('onToolbarLeaveButtonClicked', (event) => appendElement('onToolbarLeaveButtonClicked'));
	webComponent.addEventListener('onToolbarCameraButtonClicked', (event) => appendElement('onToolbarCameraButtonClicked'));
	webComponent.addEventListener('onToolbarMicrophoneButtonClicked', (event) => appendElement('onToolbarMicrophoneButtonClicked'));
	webComponent.addEventListener('onToolbarScreenshareButtonClicked', (event) => appendElement('onToolbarScreenshareButtonClicked'));
	webComponent.addEventListener('onToolbarParticipantsPanelButtonClicked', (event) =>
		appendElement('onToolbarParticipantsPanelButtonClicked')
	);
	webComponent.addEventListener('onToolbarChatPanelButtonClicked', (event) => appendElement('onToolbarChatPanelButtonClicked'));
	webComponent.addEventListener('onToolbarActivitiesPanelButtonClicked', (event) =>
		appendElement('onToolbarActivitiesPanelButtonClicked')
	);
	webComponent.addEventListener('onToolbarFullscreenButtonClicked', (event) => appendElement('onToolbarFullscreenButtonClicked'));

	webComponent.addEventListener('onToolbarStartRecordingClicked', async (event) => {
		appendElement('onToolbarStartRecordingClicked');
		// Can't test the recording
		// RECORDING_ID = await startRecording(SESSION_NAME);
	});
	// Can't test the recording
	// webComponent.addEventListener('onToolbarStopRecordingClicked', async (event) => {
	//     appendElement('onToolbarStopRecordingClicked');
	//     await stopRecording(RECORDING_ID);
	// });

	webComponent.addEventListener('onToolbarStopBroadcastingClicked', async (event) => {
		appendElement('onToolbarStopBroadcastingClicked');
	});

	webComponent.addEventListener('onActivitiesPanelStartRecordingClicked', async (event) => {
		appendElement('onActivitiesPanelStartRecordingClicked');
		// RECORDING_ID = await startRecording(SESSION_NAME);
	});

	// Can't test the recording
	// webComponent.addEventListener('onActivitiesPanelStopRecordingClicked', async (event) => {
	//     appendElement('onActivitiesPanelStopRecordingClicked');
	//     await stopRecording(RECORDING_ID);
	// });

	webComponent.addEventListener('onActivitiesPanelDeleteRecordingClicked', (event) => {
		appendElement('onActivitiesPanelDeleteRecordingClicked');
	});

	webComponent.addEventListener('onActivitiesPanelStartBroadcastingClicked', async (event) => {
		appendElement('onActivitiesPanelStartBroadcastingClicked');
	});

	webComponent.addEventListener('onActivitiesPanelStopBroadcastingClicked', async (event) => {
		appendElement('onActivitiesPanelStopBroadcastingClicked');
	});

	webComponent.addEventListener('onSessionCreated', (event) => {
		var session = event.detail;
		appendElement('onSessionCreated');

		// You can see the session documentation here
		// https://docs.openvidu.io/en/stable/api/openvidu-browser/classes/Session.html

		session.on('connectionCreated', (e) => {
			var user = JSON.parse(e.connection.data).clientData;
			appendElement(`${user}-connectionCreated`);
		});

		session.on('sessionDisconnected', (e) => {
			var user = JSON.parse(e.target.connection.data).clientData;
			appendElement(user + '-sessionDisconnected');
		});

		session.on('exception', (e) => appendElement(e.name));
	});

	webComponent.addEventListener('onParticipantCreated', (event) => {
		var participant = event.detail;
		appendElement(`${participant.nickname}-onParticipantCreated`);
	});

	// webComponent.addEventListener('error', (event) => {
	//     console.log('Error event', event.detail);
	// });

	joinSession(SESSION_NAME, PARTICIPANT_NAME);
});

function appendElement(id) {
	var eventsDiv = document.getElementById('events');
	var element = document.createElement('div');
	element.setAttribute('id', id);
	element.setAttribute('style', 'height: 1px;');
	eventsDiv.appendChild(element);
}

async function joinSession(sessionName, participantName) {
	var webComponent = document.querySelector('openvidu-webcomponent');
	var tokens;

	if (FAKE_DEVICES) {
		monkeyPatchMediaDevices();
	}

	if (SINGLE_TOKEN) {
		tokens = await getToken(sessionName);
	} else {
		tokens = { webcam: await getToken(sessionName), screen: await getToken(sessionName) };
	}

	webComponent.minimal = MINIMAL;
	webComponent.lang = LANG;
	webComponent.captionsLang = CAPTIONS_LANG;
	if (CUSTOM_LANG_OPTIONS) {
		webComponent.langOptions = [
			{ name: 'Esp', lang: 'es' },
			{ name: 'Eng', lang: 'en' }
		];
	}
	if (CUSTOM_CAPTIONS_LANG_OPTIONS) {
		webComponent.captionsLangOptions = [
			{ name: 'Esp', lang: 'es-ES' },
			{ name: 'Eng', lang: 'en-US' }
		];
	}
	webComponent.prejoin = PREJOIN;
	webComponent.videoMuted = VIDEO_MUTED;
	webComponent.audioMuted = AUDIO_MUTED;
	webComponent.toolbarScreenshareButton = SCREENSHARE_BUTTON;

	webComponent.toolbarFullscreenButton = FULLSCREEN_BUTTON;
	webComponent.toolbarSettingsButton = TOOLBAR_SETTINGS_BUTTON;
	webComponent.toolbarCaptionsButton = CAPTIONS_BUTTON;
	webComponent.toolbarLeaveButton = LEAVE_BUTTON;
	webComponent.toolbarRecordingButton = RECORDING_BUTTON;
	webComponent.toolbarBroadcastingButton = BROADCASTING_BUTTON;
	webComponent.toolbarActivitiesPanelButton = ACTIVITIES_PANEL_BUTTON;
	webComponent.toolbarChatPanelButton = CHAT_PANEL_BUTTON;
	webComponent.toolbarParticipantsPanelButton = PARTICIPANTS_PANEL_BUTTON;
	webComponent.toolbarDisplayLogo = DISPLAY_LOGO;
	webComponent.toolbarDisplaySessionName = DISPLAY_SESSION_NAME;
	webComponent.streamDisplayParticipantName = DISPLAY_PARTICIPANT_NAME;
	webComponent.streamDisplayAudioDetection = DISPLAY_AUDIO_DETECTION;
	webComponent.streamSettingsButton = SETTINGS_BUTTON;
	webComponent.participantPanelItemMuteButton = PARTICIPANT_MUTE_BUTTON;
	webComponent.participantMode = PARTICIPANT_MODE;
	webComponent.localStreamVisible = LOCAL_STREAM_VISIBLE;

	webComponent.recordingActivityRecordingsList = [{ status: 'ready' }];
	webComponent.activitiesPanelRecordingActivity = ACTIVITIES_RECORDING_ACTIVITY;
	webComponent.activitiesPanelBroadcastingActivity = ACTIVITIES_BROADCASTING_ACTIVITY;
	webComponent.recordingActivityRecordingError = RECORDING_ERROR;

	webComponent.broadcastingActivityBroadcastingError = { message: BROADCASTING_ERROR, broadcastAvailable: true };

	webComponent.participantName = participantName;
	webComponent.tokens = tokens;
}

async function getToken(sessionName) {
  const body = JSON.stringify({
    sessionId: sessionName,
  })
	try {
		const response = await fetch(OPENVIDU_SERVER_URL + "/web-call/api/v1/sessions", {
			"body": body,
			"method": "POST",
			"headers": {
				"content-type": "application/json"
			},
			"credentials": "include"
		});
		const json = await response.json();
		return json.cameraToken
	} catch (err) {
		console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + OPENVIDU_SERVER_URL);
		if (
			window.confirm(
				'No connection to OpenVidu Server. This may be a certificate error at "' +
					OPENVIDU_SERVER_URL +
					'"\n\nClick OK to navigate and accept it. ' +
					'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
					OPENVIDU_SERVER_URL +
					'"'
			)
		) {
			location.assign(OPENVIDU_SERVER_URL + '/openvidu/accept-certificate');
		}
		throw err
	}
}
