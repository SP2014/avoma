const EventEmitter = require('events')
const puppeteer = require('puppeteer-extra')
const setTimeout = require("node:timers/promises").setTimeout
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const meetingHandler = require('./handlers/meeting_handler')
const authentication = require('./handlers/auth_handler')
const message = require('./listeners/message_listener')
const member = require('./listeners/member_listener')


const stealth = StealthPlugin()
stealth.enabledEvasions.delete('iframe.contentWindow')
stealth.enabledEvasions.delete('media.codecs')
puppeteer.use(stealth)

// https://meet.google.com/rdu-ydjc-sce

class MeetBot extends EventEmitter {
    constructor() {
        super()

        // Listeners (for use in login function)
        this.message = message;
        this.member = member;
        this.timeout = setTimeout
        this.meetingLink = undefined;
        this.email = undefined

        this.puppeteer = puppeteer
        this.browser = undefined
        this.page = undefined
        this.ctx = undefined

        this.isMicEnabled = true
        this.isVideoEnabled = true
        this.isChatEnabled = undefined

        this.recentMessage = undefined
        this.members = undefined
    }

    login = authentication.authenticate

    toggleMic = meetingHandler.toggleMic
    toggleVideo = meetingHandler.toggleVideo
    toggleChat = meetingHandler.toggleChat
    toggleMemberList = meetingHandler.toggleMemberList
    //chatEnabled = meeting.chatEnabled;
    sendMessage = meetingHandler.sendMessage
    endMeeting = meetingHandler.closeMeeting
}

module.exports.MeetBot = MeetBot