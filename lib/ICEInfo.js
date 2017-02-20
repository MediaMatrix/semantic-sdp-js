

class ICEInfo
{
	constructor(ufrag, pwd) {
		this.ufrag = ufrag;
		this.pwd = pwd;
		this.lite = false;
	}

	getUfrag() {
		return this.ufrag;
	}

	getPwd() {
		return this.pwd;
	}
	
	getLite() {
		return this.lite;
	}
	
	setLite(lite) {
		this.lite = lite;
	}
	
	
}

ICEInfo.generate = function()
{
	//Create ICE info for media
	const info = new ICEInfo();
	//Create key and pwd bytes
	const frag = crypto.randomBytes(8);
	const pwd = crypto.randomBytes(24);
	//Create ramdom pwd
	info.ufrag = frag.toString('hex');
	info.pwd   = pwd.toSring('hex');
	//return this.it
	return info;
}

module.exports = ICEInfo;