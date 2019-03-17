let Wechat = require('chatwe')

let wechat = new Wechat()
wechat.setLogging('debug',false,"demo.log")
wechat.registerMapHandler(async function (msg) {
  await msg.Download()
}).registerImageHandler(async function (msg) {
  await msg.Download()
}).registerVoiceHandler(async function (msg) {
  await msg.Download()
}).registerVideoHandler(async function (msg) {
  await msg.Download()
}).registerFileHandler(async function (msg) {
  await msg.Download()
})

isEnabled = true


async function handlerControl(msg) {
	fromUser = msg.From
	toUser = msg.To
	content = msg.Content

	let replyContent = "[DONE]"
	if(content == '关闭'){
		isEnabled = false
	} else if (content == '打开') {
		isEnabled = true
	} else if (content == '1') {
		await this.replyFileTo('filehelper', 'resource/1.gif')
	} else if (content == '2') {
		await this.replyFileTo('filehelper', 'resource/2.mov')
	} else if (content == '3') {
		await this.replyFileTo('filehelper', 'resource/3.png')
	} else if (content == '4') {
		await this.replyFileTo('filehelper', 'resource/4.json')
	} else {
		await this.replyFileTo('filehelper', 'resource/1.gif')
		replyContent = `[托管中]${fromUser.NickName}您好,${this.getMyNickname()}正在赶来，急事请电话15858178942.`
	}

	let issucc = await this.reply(msg,replyContent)
	console.log('Reply ' + (issucc?'OK':'FAIL'))
	return issucc
}

function delayRevoke(userName, msgResp) {
	console.log('delayRevoke,', userName, msgResp)
	self = this
	setTimeout(async function(){
		console.log('execute delayRevoke,', userName, msgResp)
		resp = await self.revoke(userName, msgResp)
		console.log('Revoke ' + (resp?'OK':'FAIL'))
	},10000)
}

wechat.registerTextHandler(async function(msg){
	fromUser = msg.From
	toUser = msg.To
	content = msg.Content


	if('filehelper'==fromUser.UserName){
		return await handlerControl.call(this, msg)
	}

	if(!isEnabled){
		return true
	}

	if (!msg.IsFromChatRoom && !msg.IsPhoneInSession) {
		let respGif = await this.replyFile(msg, 'resource/1.gif')
		replyContent = `[消息自动撤回]${this.getMyNickname()}正在赶来.`
		let resp = await this.reply(msg,replyContent)
		console.log('Reply ' + (resp?'OK':'FAIL'))
		if(resp) {
			delayRevoke.call(this, fromUser.UserName, respGif)
			delayRevoke.call(this, fromUser.UserName, resp)
		}
		return resp
	}

	if (msg.IsAtMe) {
		userInRoom = msg.ChatRoomUser
		let respGif = await this.replyFile(msg, 'resource/1.gif')
		replyContent = `[消息自动撤回]${this.getMyNickname()}正在赶来.`
		let resp = await this.reply(msg,replyContent)
		console.log('Reply ' + (resp?'OK':'FAIL'))
		if(resp) {
			delayRevoke.call(this, fromUser.UserName, respGif)
			delayRevoke.call(this, fromUser.UserName, resp)
		}

		return resp
	}

	if (msg.FromType == 'self') {
		console.log('I Sent:', msg)
		return true
	}

})


async function main() {
	await wechat.login()
	console.log('Is Logined :', wechat.isLogined)
}


main()
