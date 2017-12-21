const SDPTransform	 = require("sdp-transform");

const CandidateInfo	 = require("./CandidateInfo");
const CodecInfo		 = require("./CodecInfo");
const DTLSInfo		 = require("./DTLSInfo");
const ICEInfo		 = require("./ICEInfo");
const MediaInfo		 = require("./MediaInfo");
const Setup		 = require("./Setup");
const Direction		 = require("./Direction");
const DirectionWay	 = require("./DirectionWay");
const SourceGroupInfo	 = require("./SourceGroupInfo");
const SourceInfo	 = require("./SourceInfo");
const StreamInfo	 = require("./StreamInfo");
const TrackInfo		 = require("./TrackInfo");
const TrackEncodingInfo	 = require("./TrackEncodingInfo");
const SimulcastInfo	 = require("./SimulcastInfo");
const SimulcastStreamInfo= require("./SimulcastStreamInfo");
const RIDInfo		 = require("./RIDInfo");

/**
 * SDP semantic info object
 *	This object represent the minimal information of an WebRTC SDP in a semantic hierarchy
 * @namespace
 */
class SDPInfo 
{
	/**
	 * @constructor
	 * @alias SDPInfo
	 * @param {Number} version SDP version attribute
	 */
	constructor(version)
	{
		this.version		= version || 1;
		this.streams		= new Map();
		this.medias		= new Array(); //Array as we need to keep order
		this.candidates		= new Array(); //Array as we need to keep order
		this.ice		= null;
		this.dtls		= null;
	}
	
	/**
	 * Clone SDPinfo object
	 * @returns {SDPInfo} cloned object
	 */
	clone() {
		//Cloned object
		const cloned = new SDPInfo(this.version);
		//For each media
		for (let i=0;i<this.medias.length;++i)
			//Push cloned 
			cloned.addMedia(this.medias[i].clone());
		//For each stream
		for (const stream of this.streams.values())
			//Push cloned stream
			cloned.addStream(stream.clone());
		//For each candiadte
		for (let i=0;i<this.candidates.length;++i)
			//Push cloned candidate
			cloned.addCandidate(this.candidates[i].clone());
		//Clone ICE and DLTS
		cloned.setICE(this.ice.clone());
		cloned.setDTLS(this.dtls.clone());
		//Return cloned object
		return cloned;
	}
	
	/**
	 * Return a plain javascript object which can be converted to JSON
	 * @returns {Object} Plain javascript object
	 */
	plain() {
		//Cloned object
		const plain = {
			version		: this.version,
			streams		: [],
			medias		: [],
			candidates	: []
		};
		//For each media
		for (let i=0;i<this.medias.length;++i)
			//Push plain
			plain.medias.push(this.medias[i].plain());
		//For each stream
		for (const stream of this.streams.values())
			//Push cloned stream
			plain.streams.push(stream.plain());
		//For each candiadte
		for (let i=0;i<this.candidates.length;++i)
			//Push cloned candidate
			plain.candidates.push(this.candidates[i].plain());
		//Add ICE and DLTS
		plain.ice = this.ice && this.ice.plain();
		plain.dtls = this.dtls && this.dtls.plain();
		//Return plain object
		return plain;
	}
	
	/**
	 * Set SDP version 
	 * @param {Number} version
	 */
	setVersion(version) 
	{
		this.version = version;
	}
	
	/**
	 * Add a new media description information to this sdp info
	 * @param {MediaInfo} media
	 */
	addMedia(media)
	{
		//Store media
		this.medias.push(media);
	}
	
	/**
	 * Get first media description info associated to the media type
	 * @param {String} type - Media type ('audio'|'video')
	 * @returns {MediaInfo} or null if not found
	 */
	getMedia(type)
	{
		for (let i in this.medias)
		{
			let media = this.medias[i];
			if (media.getType().toLowerCase()===type.toLowerCase())
				return media;
		}
		return null;
	}
	
	/**
	 * Get all media description info associated to the media type
	 * @param {String} type - Media type ('audio'|'video')
	 * @returns {Array<MediaInfo>} or null if not found
	 */
	getMedias(type)
	{
		var medias = [];
		for (let i in this.medias)
		{
			let media = this.medias[i];
			if (media.getType().toLowerCase()===type.toLowerCase())
				medias.push(media);
		}
		return medias;
	}
	
	/**
	 * Get media description info associated by media Ide
	 * @param {String} msid - Media type ('audio'|'video')
	 * @returns {MediaInfo} or null if not found
	 */
	getMediaById(msid)
	{
		for (let i in this.medias)
		{
			let media = this.medias[i];
			if (media.getId().toLowerCase()===msid.toLowerCase())
				return this.media;
		}
		return null;
	}

	/**
	 * Return all media description information
	 * @returns {Map<String,MediaInfo>}
	 */
	getMedias()
	{
		return this.medias;
	}
	
	/**
	 * Return SDP version attribute
	 * @returns {Number}
	 */
	getVersion() 
	{
		return this.version;
	}

	/**
	 * Get DTLS info for the transport bundle
	 * @returns {DTLSInfo} DTLS info object
	 */
	getDTLS() {
		return this.dtls;
	}

	/**
	 * Set DTLS info object for the transport bundle
	 * @param {DTLSInfo}  dtlsInfo - DTLS info object
	 */
	setDTLS(dtlsInfo) {
		this.dtls = dtlsInfo;
	}

	/**
	 * Get the ICE info object for the transport bundle
	 * @returns {ICEInfo} ICE info object
	 */
	getICE() {
		return this.ice;
	}

	/**
	 * Set ICE info object for the transport bundle
	 * @param {ICEInfo} iceInfo - ICE info object
	 */
	setICE(iceInfo) {
		this.ice = iceInfo;
	}

	/**
	 * Add ICE candidate for transport
	 * @param {ICECandidate} candidate - ICE candidate
	 */
	addCandidate(candidate) {
		this.candidates.push(candidate);
	}
	
	/**
	 * Add ICE candidates for transport
	 * @param {Array<{ICECandidate>} candidates - ICE candidates
	 */
	addCandidates(candidates) {
		//For each one
		for (let i=0;i<candidates.length;++i)
			//Add candidate
			this.addCandidate(candidates[i]);
	}

	/**
	 * Get all ICE candidates for this transport
	 * @returns {Array<ICECandidate>}
	 */
	getCandidates() {
		return this.candidates;
	}
	
	/**
	 * Get announced stream 
	 * @param {String} id
	 * @returns {StreamInfo}
	 */
	getStream(id)
	{
		return this.streams.get(id);
	}
	
	/**
	 * Get all announced stream 
	 * @returns {Array<StreamInfo>}
	 */
	getStreams()
	{
		return this.streams;
	}
	
	/**
	 * Get first announced stream
	 * @returns {StreamInfo}
	 */
	getFirstStream()
	{
		for (let stream of this.streams.values())
			return stream;
		return null;
	}

	/**
	 * Announce a new stream in SDP
	 * @param {StreamInfo} stream
	 */
	addStream(stream)
	{
		this.streams.set(stream.getId(), stream);
	}
	
	/**
	 * Remove an announced stream from SDP
	 * @param {StreamInfo} stream
	 */
	removeStream(stream) 
	{
		this.streams.delete(stream.getId());
	}
	/**
	 * Create answer to this SDP
	 * @param {Object} params		- Parameters to create ansser
	 * @param {ICEInfo} params.ice		- ICE info object
	 * @param {DTLSInfo} params.dtls	- DTLS info object
	 * @params{Array<CandidateInfo> params.candidates - Array of Ice candidates
	 * @param {Map<String,DTLSInfo} params.capabilites - Capabilities for each media type
	 * @returns {SDPInfo} answer
	 */
	answer(params) {
		//Create local SDP info
		const answer = new SDPInfo();

		//Add ice and dtls info
		if (params.ice)
			answer.setDTLS(params.dtls);
		if (params.dtls)
			answer.setICE(params.ice);

		//Add candidates to media info
		if (params.candidates)
			answer.addCandidates(params.candidates);
		
		//For each offered media
		for (let i in this.medias)
		{
			//Our media
			const media = this.medias[i];
			//The supported capabilities
			const supported = params && params.capabilities[media.getType()];
			//Anser it
			answer.addMedia(media.answer(supported));
		}
		//Done
		return answer;
	}
	/**
	 * Convert to an SDP string
	 * @returns {String}
	 */
	toString() 
	{
		//Create base SDP for transform
		let sdp =  {
			version : 0,
			media : []
		};
			
		//Set version
		sdp.version = 0;
		//Set origin
		sdp.origin =  {
			username	: "-",
			sessionId	: (new Date()).getTime(),
			sessionVersion	: this.version,
			netType		: "IN",
			ipVer		: 4,
			address		: "127.0.0.1"
		};
		
		//Set name
		sdp.name = "semantic-sdp";
		
		//Set connection info
		sdp.connection =  { version: 4, ip: '0.0.0.0' };
		//Set time
		sdp.timing = { start: 0, stop: 0 };
		
		//Check if it is ice lite
		if (this.getICE().isLite())
			//Add ice lite attribute
			sdp.icelite = "ice-lite";
		
		//Enable msids
		sdp.msidSemantic = { semantic : "WMS", token: "*"};
		//Create groups
		sdp.groups = [];
		
		//Bundle
		let bundle = {type : "BUNDLE", mids: []};
		
		//For each media
		for (let i in this.medias)
		{
			//Get media
			let media = this.medias[i];
			
			//Create new meida description with default values
			let  md = {
				type		: media.getType(),
				port		: 9,
				protocol	: 'UDP/TLS/RTP/SAVPF',
				fmtp		: [],
				rtp		: [],
				rtcpFb		: [],
				ext		: [],
				bandwidth	: [],
				candidates	: [],
				ssrcGroups	: [],
				ssrcs		: [],
				rids		: []
			};
		
			//Send and receive
			md.direction = Direction.toString(media.getDirection());

			//Enable rtcp muxing
			md.rtcpMux = "rtcp-mux";
			
			//Enable rtcp reduced size
			md.rtcpRsize = "rtcp-rsize";
			
			//Enable x-google-flag
			//md.addAttribute("x-google-flag","conference");

			//Set media id semantiv
			md.mid = media.getId();
			
			//Add to bundle
			bundle.mids.push(media.getId());
			
			//If present
			if (media.getBitrate()>0)
				//Add attribute
				md.bandwidth.push({
					type: "AS",
					limit: media.getBitrate()
				});

			//Get media candidates
			let candidates = this.getCandidates();
			//For each candidate
			for (let j=0; j<candidates.length; ++j)
			{
				//Get candidates
				let candidate = candidates[j];
				//Add host candidate for RTP
				md.candidates.push(
					{
						foundation	: candidate.getFoundation(),
						component	: candidate.getComponentId(),
						transport	: candidate.getTransport(),
						priority	: candidate.getPriority(),
						ip		: candidate.getAddress(),
						port		: candidate.getPort(),
						type		:candidate.getType()
					});
			}
			
			//Set ICE credentials
			md.iceUfrag = this.getICE().getUfrag();
			md.icePwd   = this.getICE().getPwd();
			
			//Add fingerprint attribute
			md.fingerprint = { 
				type : this.getDTLS().getHash(),
				hash :  this.getDTLS().getFingerprint()
			};
			
			//Add setup atttribute
			md.setup = Setup.toString(this.getDTLS().getSetup());
			
			//for each codec one
			for(let codec of media.getCodecs().values())
			{
				//Only for video
				if ("video" === media.getType().toLowerCase())
				{
					//Add rtmpmap
					md.rtp.push({
						payload	: codec.getType(),
						codec	: codec.getCodec(),
						rate	: 90000
					});
					
					//No rtx for rtx of flex fec
					if (!"flex-fec"===codec.getCodec ().toLowerCase())
					{
						//Add rtcp-fb nack support
						md.rtcpFb.push({ payload:  codec.getType(), type: "nack", subtype: "pli"});
						//Add Remb
						md.rtcpFb.push({ payload:  codec.getType(), type: "goog-remb"});
					}
				} else {
					//Check codec
					if ("opus" === codec.getCodec().toLowerCase())
						//Add rtmpmap
						md.rtp.push({
							payload	: codec.getType(),
							codec	: codec.getCodec(),
							rate	: 48000,
							encoding: 2
						});
					else 
						//Add rtmpmap
						md.rtp.push({
							payload	: codec.getType(),
							codec	: codec.getCodec(),
							rate	: 8000
						});
				} 
				//Add transport wide cc
				md.rtcpFb.push({ payload:  codec.getType(), type: "transport-cc"});
				
				//If it has rtx
				if (codec.hasRTX())
				{
					//Add it also
					md.rtp.push({
						payload	: codec.getRTX(),
						codec	: "rtx",
						rate	: 90000
					});
					//Add apt
					md.fmtp.push({
						payload	: codec.getRTX(),
						config  : "apt="+codec.getType()
					});
				}
			}
			//Create the payload array
			const payloads = [];
			
			//For each codec
			for (let j=0; j<md.rtp.length; ++j)
				//Push payload type
				payloads.push(md.rtp[j].payload);
						
			//Set it on description
			md.payloads = payloads.join(" ");
				
			//For each extension
			for (let [id,uri] of media.getExtensions().entries())
				//Add new extension attribute
				md.ext.push({
					value : id,
					uri   : uri
				});
			
			//Process rids now
			for (let ridInfo of media.getRIDs().values())
			{	
				//Create object
				let rid = { 
					id		: ridInfo.getId(),
					direction	: DirectionWay.toString (ridInfo.getDirection()),
					params		: ""
				};
				//Check if it has formats
				if (ridInfo.getFormats().length)
					rid.params = "pt=" +ridInfo.getFormats().join(',');
				//For each format
				for (let [key,val] of ridInfo.getParams().entries())
					//Add it
					rid.params += (rid.params.length ? ";" : "") + key + "=" +val;

				//Push back
				md.rids.push(rid);
			}
			
			//Get simulcast info
			const simulcast = media.getSimulcast();
			//If it has simulcast info
			if (simulcast)
			{
				let index = 1;
				//Create simulcast attribute
				md.simulcast = {};
				//Get send streams
				const send = simulcast.getSimulcastStreams(DirectionWay.SEND);
				const recv = simulcast.getSimulcastStreams(DirectionWay.RECV);

				//Check if we have send streams
				if (send && send.length)
				{
					let list = "";
					//Create list
					for (let j=0;j<send.length;++j)
					{
						//Create list
						let alternatives = "";
						//For each alternative
						for (let k=0;k<send[j].length;++k)
							//Add it
							alternatives += (alternatives.length ? "," : "") + (send[j][k].isPaused() ? "~" : "") + send[j][k].getId();
						//Add stream alternatives
						list += (list.length ? ";" : "") + alternatives;
					}
					//Set attributes
					md.simulcast["dir" +index] = "send";
					md.simulcast["list"+index] = list;
					//Inc index
					index++;
				}

				//Check if we have rec sreams
				if (recv && recv.length)
				{
					let list = [];
					//Create list
					for (let j=0;j<recv.length;++j)
					{
						//Create list
						let alternatives = "";
						//For each alternative
						for (let k=0;k<recv[j].length;++k)
							//Add it
							alternatives += (alternatives.length ? "," : "") + (recv[j][k].isPaused() ? "~" : "") + recv[j][k].getId();
						//Add stream alternatives
						list += (list.length ? ";" : "") + alternatives;
					}
					//Set attributes
					md.simulcast["dir" +index] = "recv";
					md.simulcast["list"+index] = list;
					//Inc index
					index++;
				}
			}
					
			//add media description
			sdp.media.push(md);
		}
		
		//Process streams now
		for (let stream of this.streams.values())
		{
			//For each track
			for (let track of stream.getTracks().values())
			{
				//Get media
				for (let i in sdp.media)
				{
					//Get media description
					let md = sdp.media[i];
					
					//Check if it is unified or plan B
					if (track.getMediaId())
					{
						//Unified, check if it is bounded to an specific line
						if ( track.getMediaId()===md.mid)
						{
							//Get groups
							let groups = track.getSourceGroups()

							//For each group
							for (let j in groups)
							{
								//Get group
								let group = groups[j];

								//Add ssrc group 
								md.ssrcGroups.push({
									semantics	: group.getSemantics(),
									ssrcs		: group.getSSRCs().join(" ")
								});
							}

							//Get ssrcs for that group
							let ssrcs = track.getSSRCs();

							//for each one
							for (let j in ssrcs)
							{
								//Add ssrc info
								md.ssrcs.push({
									id		: ssrcs[j],
									attribute	: "cname",
									value		: stream.getId()
								});
							}
							//Add msid
							md.msid =  stream.getId() + " " + track.getId();
							//Done
							break;
						}
					}
					//Plan B, check if it is same type
					else  if (md.type.toLowerCase() === track.getMedia().toLowerCase())
					{
						//Get groups
						let groups = track.getSourceGroups()

						//For each group
						for (let j in groups)
						{
							//Get group
							let group = groups[j];

							//Add ssrc group 
							md.ssrcGroups.push({
								semantics	: group.getSemantics(),
								ssrcs		: group.getSSRCs().join(" ")
							});
						}

						//Get ssrcs for that group
						let ssrcs = track.getSSRCs();

						//for each one
						for (let j in ssrcs)
						{
							//Add ssrc info
							md.ssrcs.push({
								id		: ssrcs[j],
								attribute	: "cname",
								value		: stream.getId()
							});
							md.ssrcs.push({
								id		: ssrcs[j],
								attribute	: "msid",
								value		: stream.getId() + " " + track.getId()
							});
						}
						//Done
						break;
					}
				}
			}
		}
		
		//Compress
		bundle.mids = bundle.mids.join(" ");
		
		//Add bundle
		sdp.groups.push(bundle);

		//Convert to string
		return SDPTransform.write(sdp);
	}
}

/**
 * Process an SDP stream and convert it to a semantic SDP info
 * @param {String} string SDP
 * @returns {SDPInfo} Parsed SDP info
 */
SDPInfo.process = function(string)
{
	//Parse SDP
	const sdp = SDPTransform.parse(string);
	
 	//Create sdp info object
	const sdpInfo = new SDPInfo();

	//Set version
	sdpInfo.setVersion(sdp.version);
	
	//For each media description
	for (let i in sdp.media)
	{
		//Get media description
		const md = sdp.media[i];

		//Get media type
		const media = md.type;

		//And media id
		const mid = md.mid;

		//Create media info
		const mediaInfo = new MediaInfo(mid,media);

		//Get ICE info
		const ufrag = md.iceUfrag;
		const pwd = md.icePwd;

		//Create iceInfo
		sdpInfo.setICE(new ICEInfo(ufrag,pwd));

		//Check media fingerprint attribute or the global one
		const fingerprintAttr = md.fingerprint || sdp.fingerprint;

		//Get remote fingerprint and hash function
		const remoteHash        = fingerprintAttr.type;
		const remoteFingerprint = fingerprintAttr.hash;

		//Set deault setup
		let setup = Setup.ACTPASS;

		//Check setup attribute
		if (md.setup)
			//Set it
			setup = Setup.byValue(md.setup);
		
		//Create new DTLS info
		sdpInfo.setDTLS(new DTLSInfo(setup,remoteHash,remoteFingerprint));
		
		//Media direction
		let direction = Direction.SENDRECV;
		
		//Check setup attribute
		if (md.direction)
			//Set it
			direction = Direction.byValue(md.direction);
		
		//Set direction
		mediaInfo.setDirection(direction);

		//Store RTX apts so we can associate them later
		const apts = new Map();

		//For each format
		for (let j in md.rtp)
		{
			//Get format
			const fmt = md.rtp[j];
			
			//Get codec and type
			const type  = fmt.payload;
			const codec = fmt.codec;

			//If it is RED or ULPFEC
			if ("RED" === codec.toUpperCase() || "ULPFEC" === codec.toUpperCase())
				//FUCK YOU!!!
				continue;
			
			//Get format parameters
			let params = {};
			
			//Does it has config
			for (let k in md.fmtp)
			{
				//Get format
				const fmtp = md.fmtp[k];
				
				//If it is this one
				if (fmtp.payload === type)
				{
					//Get list parameters
					const list = fmtp.config.split(";");
					//Parse them
					for(let k in list)
					{
						//Parse param
						const param = list[k].split("=");
						//Append param
						params[param[0].trim()] = (param[1] || "").trim();
					}
				}
			}
			//If it is RTX
			if ("RTX" === codec.toUpperCase())
				//Store atp
				apts.set(parseInt(params.apt),type);
			else
				//Create codec
				mediaInfo.addCodec(new CodecInfo(codec,type,params));
		}

		//Set the rtx
		for (let apt of apts.entries())
		{
			//Get codec
			const codecInfo = mediaInfo.getCodecForType(apt[0]);
			//IF it was not red
			if (codecInfo)
				//Set rtx codec
				codecInfo.setRTX(apt[1]);
		}

		//Get extmap atrributes
		const extmaps = md.ext;
		//For each one
		for (let j in extmaps)
		{
			//Get map
			const extmap = extmaps[j];
			//Add it
			mediaInfo.addExtension(extmap.value,extmap.uri);
		}
		
		//Get rid atrributes
		const rids = md.rids;
		//For each one
		for (let j in rids)
		{
			//Get map
			const rid = rids[j];
			//Crate info
			const ridInfo = new RIDInfo(rid.id,DirectionWay.byValue(rid.direction));
			//Create format info and param map
			let formats = [];
			const params = new Map();
			//If it has params
			if (rid.params)
			{
				//Process formats and params
				const list = SDPTransform.parseParams(rid.params);
				//For each rid param
				for (let k in list)
					//Check type
					if (k==='pt')
						//Get formats
						formats = list[k].split(','); 
					else
						//Add it to params
						params.set(k,list[k]);
				//Add formats and params
				ridInfo.setFormats(formats);
				ridInfo.setParams(params);
			}
			//Add rid info
			mediaInfo.addRID(ridInfo);
		}
		
		//Get sending encodings
		const encodings = [];
		
		//Check if it has simulcast info
		if (md.simulcast)
		{
			//Create simulcast object
			const simulcast = new SimulcastInfo();
			
			//Check dir1 attr
			if (md.simulcast.dir1)
			{
				//Get direction
				const direction = DirectionWay.byValue (md.simulcast.dir1);
				//Parse simulcast streamlist
				const list = SDPTransform.parseSimulcastStreamList(md.simulcast.list1);
				//for each alternative stream set
				for (let j=0; j<list.length; ++j)
				{
					//Create the list of alternatie streams
					const alternatives = [];
					//For each alternative
					for (let k=0; k<list[j].length; ++k)
						//Push new alternative stream
						alternatives.push(new SimulcastStreamInfo(list[j][k].scid, list[j][k].paused));
					//Add alternative
					simulcast.addSimulcastAlternativeStreams(direction, alternatives);
				}
			}
			//Check dir2 attr
			if (md.simulcast.dir2)
			{
				//Get direction
				const direction = DirectionWay.byValue (md.simulcast.dir2);
				//Parse simulcast streamlist
				const list = SDPTransform.parseSimulcastStreamList(md.simulcast.list2);
				//for each alternative stream set
				for (let j=0; j<list.length; ++j)
				{
					//Create the list of alternatie streams
					const alternatives = [];
					//For each alternative
					for (let k=0; k<list[j].length; ++k)
						//Push new alternative stream
						alternatives.push(new SimulcastStreamInfo(list[j][k].scid, list[j][k].paused));
					//Add alternative
					simulcast.addSimulcastAlternativeStreams(direction, alternatives);
				}
			}
			
			//For all sending encodings
			for (let streams of simulcast.getSimulcastStreams(DirectionWay.SEND))
			{
				//Create encoding alternatives
				const alternatives = [];
				//for all rid info
				for (let j=0; j<streams.length; j++)
				{
					//Create new encoding
					const encoding = new TrackEncodingInfo(streams[j].getId(),streams[j].isPaused());
					//Get the rid info for that 
					const ridInfo = mediaInfo.getRID(encoding.getId());
					//If found
					if (ridInfo)
					{
						//Get associated payloads, jic
						const formats = ridInfo.getFormats();
						//If it had formats associated
						for (let k=0; formats && k<formats.length; ++k)
						{
							//Get codec info
							const codecInfo = mediaInfo.getCodecForType(formats[k]);
							//If found
							if (codecInfo)
								//Set into encoding
								encoding.addCodec(codecInfo);
						}
						//Add them
						encoding.setParams(ridInfo.getParams());
						//Push it
						alternatives.push(encoding);
					}
				}
				//If any
				if (alternatives.length)
					//Add it
					encodings.push(alternatives);
			}
			
			//Add it
			mediaInfo.setSimulcast(simulcast);
		}

		//Temporal source list
		const sources = new Map();

		//Doubel check
		if (md.ssrcs)
		{
			//Get all ssrcs
			for (let j in md.ssrcs)
			{
				//Get attribute
				let ssrcAttr = md.ssrcs[j];
				//Get data
				let ssrc  = ssrcAttr.id;
				let key   = ssrcAttr.attribute;
				let value = ssrcAttr.value;
				//Try to get it
				let source = sources.get(ssrc);
				//If we dont have ssrc yet
				if (!source)
				{
					//Create one
					source = new SourceInfo(ssrc);
					//Add it
					sources.set(source.getSSRC(),source);
				} 
				//Check key
				if ("cname" === key.toLowerCase())
				{
					//Set it
					source.setCName(value);
				} else if ("msid" === key.toLowerCase()) {
					//Split
					let ids = value.split(" ");
					//Get stream and track ids
					let streamId = ids[0];
					let trackId  = ids[1];
					//Set ids
					source.setStreamId(streamId);
					source.setTrackId(trackId);
					//Get stream
					let stream = sdpInfo.getStream(streamId);
					//Check if the media stream exists
					if (!stream)
					{
						//Create one
						stream = new StreamInfo(streamId);
						//Append
						sdpInfo.addStream(stream);
					}
					//Get track
					let track = stream.getTrack(trackId);
					//If not found
					if (!track)
					{
						//Create track
						track = new TrackInfo(media,trackId);
						//Set simulcast encodings (if any)
						track.setEncodings(encodings);
						//Append to stream
						stream.addTrack(track);
					}
					//Add ssrc
					track.addSSRC(ssrc);
				}	
			}
		}
		
		//Check if ther is a global msid
		if (md.msid)
		{
			//Split
			let ids = md.msid.split(" ");
			//Get stream and track ids
			let streamId = ids[0];
			let trackId  = ids[1];
		
			//Get stream
			let stream = sdpInfo.getStream(streamId);
			//Check if the media stream exists
			if (!stream)
			{
				//Create one
				stream = new StreamInfo(streamId);
				//Append
				sdpInfo.addStream(stream);
			}
			//Get track
			let track = stream.getTrack(trackId);
			//If not found
			if (!track)
			{
				//Create track
				track = new TrackInfo(media,trackId);
				//Set the media id
				track.setMediaId(mid);
				//Set encodings (if any)
				track.setEncodings(encodings);
				//Append to stream
				stream.addTrack(track);
			}
			
			//For each ssrc
			for (let [ssrc,source] of sources.entries())
			{
				//If it was not overrideng
				if (!source.getStreamId())
				{
					//Set ids
					source.setStreamId(streamId);
					source.setTrackId(trackId);
					//Add ssrc
					track.addSSRC(ssrc);
				}
			}
		}

		//Double check
		if (md.ssrcGroups)
		{
			//Get all groups
			for (let j in md.ssrcGroups)
			{
				//Get ssrc group info
				let ssrcGroupAttr = md.ssrcGroups[j];
				
				//Get ssrcs
				let ssrcs = ssrcGroupAttr.ssrcs.split(" ");
				
				//Create new group
				let group = new SourceGroupInfo(ssrcGroupAttr.semantics,ssrcs);
				
				//Get media track for ssrc
				let source = sources.get(parseInt(ssrcs[0]));
				//Add group to track
				sdpInfo
				    .getStream(source.getStreamId())
				    .getTrack(source.getTrackId())
				    .addSourceGroup(group);
			}
		}
		//Append media
		sdpInfo.addMedia(mediaInfo);
	}
	return sdpInfo;
};

module.exports = SDPInfo;
