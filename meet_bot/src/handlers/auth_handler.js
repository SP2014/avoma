async function authenticate({ link, email, pass }) {
    this.meetingLink = link
    this.email = email
    this.puppeteer.launch({
        headless: false,
        devtools: false,
        args: [
            "--no-sandbox",
            "--disable-gpu",
            "--enable-webgl",
            "--window-size=800,800",
        ],
        //ignoreDefaultArgs: true,
        //args: ['--disable-notifications', '--enable-automation', '--start-maximized'],
    }).then(async browser => {
        this.browser = browser
        const page = await browser.newPage()
        const acceptBeforeUnload = dialog =>
            dialog.type() === 'beforeunload' && dialog.accept()

        page.on('dialog', acceptBeforeUnload)
        this.page = page

        const loginUrl =
            "https://accounts.google.com/AccountChooser?service=mail&continue=https://google.com&hl=en"
        const ua =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36"

        await page.setUserAgent(ua)
        await page.goto(loginUrl, { waitUntil: "networkidle2" })
        await page.type('input[type="email"]', email);
        await page.keyboard.press("Enter")
        page
            .waitForSelector('input[type="password"]', { visible: true })
            .then(async () => {
                await page.type('input[type="password"]', pass)
                await page.keyboard.press("Enter")
            })

        const context = browser.defaultBrowserContext()
        await context.overridePermissions("https://meet.google.com/", [
            "microphone",
            "camera",
            "notifications",
        ])
        await page.waitForFunction(
            "window.location.href == 'https://www.google.com/'"
        )
        await page.goto(link)

        console.log("Authenticated successfully!")

        // Apply effects
        //U26fgb JRY2Pb mUbCce kpROve yBiuPb y1zVCf M9Bg4d

        //Microphone muted
        await page.waitForSelector(
            ".U26fgb.JRY2Pb.mUbCce.kpROve.yBiuPb.y1zVCf.M9Bg4d.HNeRed"
        );
        await page.click(
            ".U26fgb.JRY2Pb.mUbCce.kpROve.yBiuPb.y1zVCf.M9Bg4d.HNeRed"
        );

        //Camera off
        await page.waitForSelector(
            ".U26fgb.JRY2Pb.mUbCce.kpROve.yBiuPb.y1zVCf.M9Bg4d.HNeRed"
        );
        await page.click(
            ".U26fgb.JRY2Pb.mUbCce.kpROve.yBiuPb.y1zVCf.M9Bg4d.HNeRed"
        );

        // Join Button
        await this.timeout(1500)
        const askButtonQuery = "button >>>> ::-p-text(Ask to join)"
        const joinButtonQuery = "button >>>> ::-p-text(Join now)";
        let selector

        const jtextSelector = await page.waitForSelector(joinButtonQuery, { visible: true, timeout: 10000 })
        if (jtextSelector) {
            selector = jtextSelector
        }
        else {
            selector = await page.waitForSelector(askButtonQuery, { timeout: 1000 })
        }

        const joinButtonClass =
            "." +
            (await selector?.evaluate((el) => el.parentNode.className)).replaceAll(
                " ",
                "."
            )
        await page.waitForSelector(joinButtonClass, { visible: true })
        await page.click(joinButtonClass)

        this.timeout(3000)
        const disselector = await this.page.waitForSelector('span ::-p-text(Got it)')
        const OkButtonClass =
            "." +
            (await disselector?.evaluate((el) => el.parentNode.className)).replaceAll(
                " ",
                "."
            )
        await page.waitForSelector(OkButtonClass, { visible: true })
        await page.click(OkButtonClass)
        this.timeout(2000)
        await this.toggleMemberList()
        //this.message.messageListener(this)
        this.member.memberListener(this) // Start listeners

        console.log("Meeting joined, and listeners are listening!")
        this.emit('ready')
    })
}

module.exports = { authenticate: authenticate }