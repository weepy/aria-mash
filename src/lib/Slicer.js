import { getRemoteAudio, sliceAudioBuffer, reverseAudioBuffer, playBufferSync, fadeBufferStartAndEnd } from "$lib/utils.js"

export default class Slicer {
    constructor({ context, url, sliceLength, numSlices }) {
        this.context = context
        this.sliceLength = Math.floor(sliceLength)

        this.slices = []


        // this.slicePositions = []
        this.sliceOptions = []

        for (let i = 0; i < numSlices; i++) {
            // this.slicePositions[i] = i
            this.sliceOptions[i] = {
                position: i,
                bank: 0
            }
        }
    }

    async loadUrl(url) {
        this.url = url
        const buffer = await getRemoteAudio(url, this.context)
        this.loadBuffer(buffer)
    }


    loadBuffer(buffer) {

        const slices = sliceAudioBuffer(buffer, this.sliceLength)

        slices.forEach((slice) => {
            fadeBufferStartAndEnd(slice)
        })


        this.slices = slices

        this.rev_slices = slices.map(s => reverseAudioBuffer(s))




    }

    play() {

        this.playing = true
        this.slicePos = 0
        this._playNextSlice()

    }

    stop() {
        this.playing = false
    }

    _playNextSlice() {

        if (!this.playing) {
            return
        }
        if (this.slicePos >= this.sliceOptions.length) {
            this.slicePos = 0
        }

        const sliceOptions = this.sliceOptions[this.slicePos]

        const bank = sliceOptions.bank

        const optsLookUp = [
            { speed: 1, reverse: false },
            { speed: 1, reverse: true },
            { speed: 0.5, reverse: false },
            { speed: 0.5, reverse: true },
            { speed: 2, reverse: false },
            { speed: 2, reverse: true },
        ];

        const speed = optsLookUp[bank].speed
        const reverse = optsLookUp[bank].reverse

        const sliceBank = reverse ? this.rev_slices : this.slices
        const slice = sliceBank[sliceOptions.position]

        this.playerNode = playBufferSync(this.context, slice, speed, () => {
            this.slicePos += 1
            this._playNextSlice()
        })


    }


}

