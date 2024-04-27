async function messageListener(MeetBot) {
    async function getRecentMessage() {
        var message = await MeetBot.page.evaluate(() => {
            chat = document.querySelector('.z38b6').lastChild
            return {
                author: chat.firstChild.firstChild.innerText,
                time: chat.firstChild.lastChild.innerText,
                content: chat.lastChild.lastChild.innerText
            } // See div.html
        })
        if (message.author !== "You") {
            await MeetBot.emit('message', message)
            MeetBot.recentMessage = message
            return message
        }
    }

    await MeetBot.page.waitForSelector('.GDhqjd', { timeout: 0 })
    getRecentMessage()
    await MeetBot.page.exposeFunction('getRecentMessage', getRecentMessage)

    await MeetBot.page.evaluate(() => {
        // https://stackoverflow.com/questions/47903954/how-to-inject-mutationobserver-to-puppeteer
        // https://stackoverflow.com/questions/54109078/puppeteer-wait-for-page-dom-updates-respond-to-new-items-that-are-added-after/54110446#54110446
        messageObserver = new MutationObserver(() => { getRecentMessage(); })
        messageObserver.observe(document.querySelector('.z38b6'), { subtree: true, childList: true })
    });
}

module.exports = {
    messageListener: messageListener
}