async function memberJoinListener(MeetBot) {

    while (true) {
        const mm = await MeetBot.page.waitForSelector('div[role="list"]', { visible: true, timeout: 0 })
        var member = await MeetBot.page.evaluate(body => {
            return body.lastChild.firstChild.lastChild.firstChild.firstChild.innerText
        }, mm)
        //console.log(member)
        await MeetBot.emit('memberJoin', MeetBot.members[member])
        await MeetBot.page.waitForSelector('div[role="list"]', { hidden: true, timeout: 0 })
    }

}

async function memberLeaveListener(MeetBot) {

    while (true) {
        members = MeetBot.members // memberLeaveListener keeps own copy of member list (because when a member leaves, the list gets updated and memberLeaveListener doesn't get the member's info)
        await MeetBot.page.waitForSelector('.aGJE1b', { visible: true, timeout: 0 }) // wait for member to leave
        var member = await MeetBot.page.evaluate(() => {
            member = document.querySelector('.aGJE1b')
            if (member.innerText.endsWith(' has left the meeting')) {
                return member.innerText.replace(' has left the meeting', '')
            } else {
                return null
            }
        })
        if (member === null) { continue }
        await MeetBot.emit('memberLeave', members[member])
        await MeetBot.page.waitForSelector('.aGJE1b', { hidden: true, timeout: 0 })
    }

}

async function memberListener(MeetBot) {

    async function getMembers() {
        const member_list = await MeetBot.page.waitForSelector('div[role="list"]', { visible: true, timeout: 0 })
        var vv = await MeetBot.page.evaluate(body => {
            let members = {}
            for (var i = 0; i < body.childNodes.length; i++) {
                const member = {
                    name: body.childNodes[i].firstChild.lastChild.firstChild.firstChild.innerText,
                    icon: body.childNodes[i].firstChild.firstChild.firstChild.src
                }
                members[member.name] = member
            }
            return members
        }, member_list)

        if (MeetBot.members) {
            for ([key, value] of Object.entries(MeetBot.members)) {
                if (vv.hasOwnProperty(key)) {

                }
                else {
                    await MeetBot.emit('memberLeave', key)
                }

                if (MeetBot.members.hasOwnProperty(key)) {

                }
                else {

                    await MeetBot.emit('memberJoin', key)
                }
            }
        }
        else {
            for ([key, value] of Object.entries(vv)) {
                await MeetBot.emit('memberJoin', key)
            }
        }

        console.log(vv)

        MeetBot.members = vv
    }

    await getMembers()

    //memberJoinListener(MeetBot)
    //memberLeaveListener(MeetBot)

    await MeetBot.page.exposeFunction('getMembers', getMembers)


    const member_list = await MeetBot.page.waitForSelector('div[role="list"]', { visible: true, timeout: 0 })
    await MeetBot.page.evaluate(body => {
        // memberObserver = new MutationObserver(() => {
        //     console.log("callback that runs when observer is triggered");
        // })

        // memberObserver.observe(body, {
        //     subtree: true,
        //     childList: true,
        // })
        memberObserver = new MutationObserver(() => { getMembers() })
        memberObserver.observe(document.querySelector('div[role="list"]'), { subtree: true, childList: true })
    }, member_list)
}

module.exports = {
    memberListener: memberListener
}