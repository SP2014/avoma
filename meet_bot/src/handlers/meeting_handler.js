async function toggleMic() {
    await this.page.keyboard.down('ControlLeft')
    await this.page.keyboard.press('KeyD')
    await this.page.keyboard.up('ControlLeft')
    this.micEnabled = !this.micEnabled
}

async function closeMeeting() {
    const node = await this.page.waitForSelector('::-p-aria(Leave call)')
    await node.click()
    await this.browser.close()
}

async function toggleVideo() {
    await this.page.keyboard.down('ControlLeft')
    await this.page.keyboard.press('KeyE')
    await this.page.keyboard.up('ControlLeft')
    this.isVideoEnabled = !this.isVideoEnabled
}

async function toggleMemberList() {
    const node = await this.page.waitForSelector('::-p-aria(Show everyone)')
    await node.click()
}

async function toggleChat() {
    //var chatBtn = await this.page.waitForXPath('/html/body/div[1]/c-wiz/div[1]/div/div[9]/div[3]/div[10]/div[3]/div[3]/div/div/div[3]/span/button');
    //await chatBtn.click();
}

async function sendMessage(message) {
    const node = await this.page.waitForSelector('::-p-aria(Chat with everyone)')
    await node.click()

    var chat = await this.page.waitForSelector('#bfTqV');
    await chat.focus();
    await this.page.$eval('#bfTqV', (input, message) => { input.value = message; console.log(input); console.log(message) }, message); // replaced `await page.keyboard.type(message)`, because this is a little more instant
    await this.page.keyboard.press('Enter');

    const node2 = await this.page.waitForSelector('::-p-aria(Show everyone)')
    await node2.click()
}



module.exports = {
    toggleMic: toggleMic,
    toggleVideo: toggleVideo,
    toggleMemberList: toggleMemberList,
    toggleChat: toggleChat,
    sendMessage: sendMessage,
    closeMeeting: closeMeeting,
}