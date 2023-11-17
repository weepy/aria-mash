
let audioCtx


export async function getRemoteAudio_nocache(url) {

    audioCtx = audioCtx || new AudioContext()
    const response = await fetch(url, { mode: 'cors' })
    const data = await response.arrayBuffer()

    return await audioCtx.decodeAudioData(data)
}

const cache = {}
export async function getRemoteAudio(url) {
    if (cache[url]) {
        return cache[url]
    }

    const buffer = await getRemoteAudio_nocache(url)
    cache[url] = buffer

    return buffer

}

export function fadeBufferStartAndEnd(buffer, fadeSamples = 50) {
    const numberOfChannels = buffer.numberOfChannels;

    for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = buffer.getChannelData(channel);

        // Apply fade-in at the start
        for (let i = 0; i < fadeSamples && i < channelData.length; i++) {
            const fadeFactor = i / fadeSamples;
            channelData[i] *= fadeFactor;
        }

        // Apply fade-out at the end
        for (let i = channelData.length - 1, j = 0; j < fadeSamples && i >= 0; i--, j++) {
            const fadeFactor = j / fadeSamples;
            channelData[i] *= fadeFactor;
        }
    }
}


export function playBufferSync(context, buffer, speed, onended) {
    const node = new AudioBufferSourceNode(context, { buffer })
    node.start(context.currentTime)
    node.playbackRate.value = speed
    node.connect(context.destination)
    node.onended = onended
    return node
}


export function playBuffer(context, buffer) {
    return new Promise((res) => {
        const node = new AudioBufferSourceNode(context, { buffer })
        node.start(context.currentTime)
        node.connect(context.destination)
        node.onended = res
    })
}
export function reverseAudioBuffer(audioBuffer) {
    // Create a new empty AudioBuffer with the same characteristics
    let reversedBuffer = new AudioBuffer({
        numberOfChannels: audioBuffer.numberOfChannels,
        length: audioBuffer.length,
        sampleRate: audioBuffer.sampleRate
    });

    // Loop through each channel
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        // Get the data of the channel
        let channelData = audioBuffer.getChannelData(channel);
        let reversedChannelData = reversedBuffer.getChannelData(channel);

        // Reverse the data and copy it to the new buffer
        for (let i = 0; i < channelData.length; i++) {
            reversedChannelData[i] = channelData[channelData.length - i - 1];
        }
    }

    return reversedBuffer;
}

export function sliceAudioBuffer(source, sliceLength) {
    const sampleRate = source.sampleRate;
    const numberOfChannels = source.numberOfChannels;
    const slices = [];

    // Calculate the total number of slices
    const totalSlices = Math.floor(source.length / sliceLength);

    for (let sliceIndex = 0; sliceIndex < totalSlices; sliceIndex++) {
        // Create a new AudioBuffer for each slice
        const sliceBuffer = new AudioBuffer({
            length: sliceLength,
            numberOfChannels: numberOfChannels,
            sampleRate: sampleRate
        });

        for (let channel = 0; channel < numberOfChannels; channel++) {
            const sourceData = source.getChannelData(channel);
            const sliceData = sliceBuffer.getChannelData(channel);

            // Calculate start and end points for the slice
            const start = sliceIndex * sliceLength;
            const end = Math.min(start + sliceLength, sourceData.length);

            // Copy data from the source buffer to the slice
            for (let i = start, j = 0; i < end; i++, j++) {
                sliceData[j] = sourceData[i];
            }
        }

        // Add the slice to the slices array
        slices.push(sliceBuffer);
    }

    return slices;
}

// export function sliceAudioBuffer(source, sliceLength) {



//     const slices = []


//     const dest = new AudioBuffer({
//         length: sliceLength,
//         numberOfChannels: source.numberOfChannels,
//         sampleRate: source.sampleRate
//     })


//     for (let i = 0; i < dest.numberOfChannels; i++) {



//         const samples = source.getChannelData(i)
//         const sliced = samples.slice(0, sliceLength)
//         dest.getChannelData(i).set(sliced)

//     }

//     return dest
// }



export function playBuffer2(buf, loop = false) {

    audioCtx = audioCtx || new AudioContext()

    const node = audioCtx.createBufferSource();
    node.buffer = buf;

    node.connect(audioCtx.destination);
    node.loop = loop;
    node.start();

    return node
}


export function audioBufferToObject(audioBuffer) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    let channels = [];

    for (let i = 0; i < numberOfChannels; i++) {
        // Copy channel data
        channels.push(audioBuffer.getChannelData(i).slice().buffer);
    }

    return { channels, sampleRate, numberOfChannels };
}

import localforage from "localforage"

localforage.setAudio = async function (key, buf) {
    await localforage.setItem(key, audioBufferToObject(buf))
}

localforage.getAudio = async function (key) {
    const o = await localforage.getItem(key)
    return objectToAudioBuffer(o)
}


export function objectToAudioBuffer(obj) {

    const { channels, sampleRate, numberOfChannels } = obj;


    const channelDatas = []
    for (let i = 0; i < numberOfChannels; i++) {
        channelDatas[i] = new Float32Array(channels[i])
    }

    const newBuffer = new AudioBuffer({ length: channelDatas[0].length, numberOfChannels, sampleRate: 44100 })

    for (let i = 0; i < numberOfChannels; i++) {
        newBuffer.copyToChannel(channelDatas[i], i);
    }

    return newBuffer;
}