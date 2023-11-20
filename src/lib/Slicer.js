import { sliceAudioBuffer, playBufferSync, fadeBufferStartAndEnd } from "$lib/utils.js"

export default class Slicer {
    constructor({ context, url, sliceLength, numSlices }) {
        this.context = context
        this.sliceLength = Math.floor(sliceLength)

        this.sliceBanks = []


        this.slicePositions = []
        this.sliceBankPositions = []

        for (let i = 0; i < numSlices; i++) {
            this.slicePositions[i] = i
            this.sliceBankPositions[i] = 0
        }
    }

    loadBuffer(bankIndex, buffer) {

        // this.buffer = buffer

        const slices = sliceAudioBuffer(buffer, this.sliceLength)
        slices.forEach((slice) => {
            fadeBufferStartAndEnd(slice)
        })

        this.sliceBanks[bankIndex] = slices

        // this.slicePositions = []

        // slices.forEach((slice, index) => {
        //     this.slicePositions[index] = 0
        // })


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
        if (this.slicePos >= this.slicePositions.length) {
            this.slicePos = 0
        }

        let bankIndex = this.sliceBankPositions[this.slicePos]

        const slices = this.sliceBanks[bankIndex]

        let sliceIndex = this.slicePositions[this.slicePos]

        const slice = slices[sliceIndex % slices.length]


        this.playerNode = playBufferSync(this.context, slice, 1, () => {
            this.slicePos += 1
            this._playNextSlice()
        })


    }


}

