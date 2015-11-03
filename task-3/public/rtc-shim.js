var RtcShim = function () {
    var socket = io();
    var pc = null; // PeerConnection
    var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection || window.msRTCPeerConnection;
    var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
    var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
    var channel;

    var browser = {
        mozilla: /firefox/i.test(navigator.userAgent),
        chrome: /chrom(e|ium)/i.test(navigator.userAgent)
    };
    var arrayToStoreChunks = [];

    /**
     * autorun
     */
    socket.emit('webrtc-prepare');

    /**
     *
     * @returns {*}
     */
    function getChannel () {
        return channel;
    }


    /**
     * Step 1. connect
     */
    function _connect (initiator) {
        pc = new PeerConnection(null);
        pc.onicecandidate = onIceCandidate;
        pc.onclosedconnection = onClosedConnection;

        if (initiator) {
            openOfferChannel();
            createOffer();
            socket.emit('webrtc-ready');
        } else {
            openAnswerChannel();
        }
    }


    /**
     *
     */
    function openOfferChannel () {
        channel = pc.createDataChannel('RTCDataChannel', browser.chrome ? { reliable: false } : {});
        setChannelEvents();
    }

    /**
     *
     */
    function openAnswerChannel () {
        pc.ondatachannel = function (e) {
            channel = e.channel;
            if (browser.mozilla) channel.binaryType = 'blob';

            setChannelEvents();
        };
    }

    /**
     *
     */
    function setChannelEvents () {
        channel.onopen = function () {
            console.log('Channel opened');
        };
        channel.onclose = function () {
            console.log('Channel closed');
        };
        channel.onerror = function (err) {
            console.log('Channel error:', err);
        };
        channel.onmessage = function (event) {
            var data = JSON.parse(event.data);
            arrayToStoreChunks.push(data.message);
            if (data.last) {
                saveToDisk(arrayToStoreChunks.join(''), data.filename);
                arrayToStoreChunks = [];
            }
        };
    }

    /**
     *
     * @param fileUrl
     * @param fileName
     */
    function saveToDisk (fileUrl, fileName) {
        var save = document.createElement('a');
        save.href = fileUrl;
        save.target = '_blank';
        save.download = fileName || fileUrl;

        var event = document.createEvent('Event');
        event.initEvent('click', true, true);

        save.dispatchEvent(event);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

    /**
     * Step 2. createOffer
     */
    function createOffer () {
        pc.createOffer(
            gotLocalDescription,
            function (error) {
                console.error(error)
            },
            { 'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } }
        );
    }


    /**
     * Step 3. createAnswer
     */
    function createAnswer () {
        pc.createAnswer(
            gotLocalDescription,
            function (error) {
                console.error(error)
            },
            { 'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } }
        );
    }

    /**
     *
     * @param description
     */
    function gotLocalDescription (description) {
        pc.setLocalDescription(description);
        sendMessage({
            type: description.type,
            sdp: description.sdp
        });
    }

    /**
     *
     * @param event
     */
    function onIceCandidate (event) {
        if (event.candidate) {
            sendMessage({
                type: 'candidate',
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                sdpMid: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });

        }
    }

    /**
     *
     */
    function onClosedConnection () {
        pc.close();
        pc = null;
    }

    /**
     *
     * @param message
     */
    function sendMessage (message) {
        socket.emit('webrtc', message);
    }

    socket.on('webrtc', function (message) {
        if (message.type === 'offer') {
            pc.setRemoteDescription(new SessionDescription(message));
            createAnswer();
        }
        else if (message.type === 'answer') {
            pc.setRemoteDescription(new SessionDescription(message));
        }
        else if (message.type === 'candidate') {
            var candidate = new IceCandidate({ sdpMLineIndex: message.label, candidate: message.candidate });
            pc.addIceCandidate(candidate);
        }
    });

    socket.on('webrtc-handshake', function (data) {
        _connect(data.initiator);
    });

    return {
        getChannel: getChannel
    }
};