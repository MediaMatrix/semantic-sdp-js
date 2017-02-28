# semantic-sdp-js
Minimal SDP information semantic data model and parsing tools

## Install

    npm i --save semantic-sdp

## Usage
```javascript
const SemanticSDP = require('semantic-sdp');
```
## API Documention
You can check the full object documentation [here](https://medooze.github.io/semantic-sdp-js/).

## Example

```javascript
const SemanticSDP	= require("semantic-sdp");

//Process the sdp
var offer = SemanticSDP.SDPInfo.process(sdp);

//Set the local DTLS and ICE info
const dtls = new DTLSInfo(Setup.PASSIVE,"sha-256","F2:AA:0E:C3:22:59:5E:14:95:69:92:3D:13:B4:84:24:2C:C2:A2:C0:3E:FD:34:8E:5E:EA:6F:AF:52:CE:E6:0F");
const ice  = new ICEInfo("af46F","a34FasdS++jdfofdslkjsd/SDV");

//Get local candidte
const candidate = new CandidateInfo(1,1, "udp", 2122260223, "192.168.0.196", 56143, "host");

//Create local SDP info
let answer = new SDPInfo();

//Get remote audio m-line info 
let audioOffer = offer.getAudio();

//If we have audio
if (audioOffer)
{
	//Create audio media
	let audio = new MediaInfo("audio", "audio");
	//Add ice and dtls info
	audio.setDTLS(dtls);
	audio.setICE(ice);
	audio.addCandidate(candidate);
	//Get codec type
	let opus = audioOffer.getCodec("opus");
	//Add opus codec
	audio.addCodec(opus);

	//Add audio extensions
	for (let extension of audioOffer.getExtensions().entries())
		//Add it
		audio.addExtension(extension[0], extension[1]);
	//Add it to answer
	answer.addMedia(audio);
}

//Get remote video m-line info 
let videoOffer = offer.getVideo();

//If offer had video
if (videoOffer)
{
	//Create video media
	let  video = new MediaInfo("video", "video");
	//Add ice and dtls info
	video.setDTLS(dtls);
	video.setICE(ice);
	video.addCandidate(candidate);
	//Get codec types
	let vp9 = videoOffer.getCodec("vp9");
	let fec = videoOffer.getCodec("flexfec-03");
	//Add video codecs
	video.addCodec(vp9);
	if (fec)
		video.addCodec(fec);
	//Limit incoming bitrate
	video.setBitrate(1024);

	//Add video extensions
	for (let extension of videoOffer.getExtensions().entries())
		//Add it
		video.addExtension(extension[0], extension[1]);

	//Add it to answer
	answer.addMedia(video);
}

let ssrc = 1000;
//For each stream
for (let i=1;i<4;i++)
{
	let track;
	//Create stream
	let stream = new StreamInfo("sream"+i);
	//Create track
	track = new TrackInfo("video", "track1");
	//Add ssrc
	track.addSSRC(ssrc++);
	//Add it
	stream.addTrack(track);
	//Create track
	track = new TrackInfo("audio", "track2");
	//Add ssrc
	track.addSSRC(ssrc++);
	//Add it
	stream.addTrack(track);
	//Add stream
	answer.addStream(stream);
}

//Get answer SDP
const str = answer.toString();
```

## Author

Sergio Garcia Murillo @ Medooze

## License
MIT
