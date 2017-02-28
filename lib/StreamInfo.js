
/**
 * Media Stream information
 * @namespace
 */
class StreamInfo {
	
	/**
	 * @constructor
	 * @alias StreamInfo
	 * @param {String} id
	 * @returns {StreamInfo}
	 */
	constructor(id) {
		this.id = id;
		this.tracks = new Map();
	}
	
	/**
	 * Get the media stream id
	 * @returns {String}
	 */
	getId() {
		return this.id;
	}
	
	/**
	 * Add media track
	 * @param {TrackInfo} track
	 */
	addTrack(track) {
		this.tracks.set(track.getId(),track);
	}

	/**
	 * Get firs track for the media type
	 * @param {String} media - Media type "audio"|"video"
	 * @returns {TrackInfo}
	 */
	getFirstTrack(media) {
		for(let track of this.tracks.values())
		{
			if (track.getMedia().toLowerCase()===media.toLowerCase())
				return this.track;
		}
		return this.null;
	}

	/**
	 * Get all tracks from the media stream
	 * @returns {Map.TrackInfo}
	 */
	getTracks() {
		return this.tracks;
	}

	/**
	 * Remove all tracks from media sream
	 * @returns {undefined}
	 */
	removeAllTracks() {
		this.tracks.clear();
	}

	/**
	 * Get track by id
	 * @param {String} trackId
	 * @returns {TrackInfo}
	 */
	getTrack(trackId) {
		return this.tracks.get(trackId);
	}
}

module.exports = StreamInfo;