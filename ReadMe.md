# Google-Meet-Bot
Using JavaScript and NodeJS (Puppeteer module), this script automates signing in to Google in extra stealth, navigates to Google Meet wih disabled notifications, turns off camera and microphone before joining the meeting, emits members in the meeting and allow mechanism to send messages to all participants. 

## Main Components

### 1. Websocket Server

Incorporated a simple websocket server based on 'SocketIO' libray, to connect through client application. All the commands are executed from this server as well as updates are also reflected on the same.

### 2. Meet Client

Implemented a meet client which works on Puppeteer module to simulate user actions through automation. Below are the mentioned steps.

1. Login to Google using email and password provided.
2. Join Google meet link once authenticated.
3. Mute microphone and camera before joining the meeting.
4. Open members icon to get list of participants.  

## How to use
- Install all the node dependencies in each folder.
- First start the main server, followed by google meet client.

## Execution Steps
- Starting the main server
  <code>cd avoma/server</code>
  <code>npm run start:dev</code>
- Starting the google meet client
  <code>cd avoma/meet_bot</code>
  <code>npm run start:dev</code>

## Limitations
- Email/password is not configured through environment variables.
- Server is a basic implementation without middlewares and routing.
- Meeting link should be generated from the same domain as Email.