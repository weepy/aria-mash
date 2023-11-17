import { sliceAudioBuffer, playBufferSync, fadeBufferStartAndEnd } from "$lib/utils.js"

export default class Slicer {
    constructor({ context, url, sliceLength, numSlices }) {
        this.context = context
        this.sliceLength = Math.floor(sliceLength)

        this.sliceSlots = []
        this.slicePositions = new Array(numSlices)

        this.slicePositions.forEach((slice, index) => {
            this.slicePositions[index] = 0
        })
    }

    loadBuffer(slot, buffer) {

        // this.buffer = buffer

        const slices = sliceAudioBuffer(buffer, this.sliceLength)
        slices.forEach((slice) => {
            fadeBufferStartAndEnd(slice)
        })

        this.sliceSlots[slot] = slices

        this.slicePositions = []

        slices.forEach((slice, index) => {
            this.slicePositions[index] = 0
        })

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



        if (this.slicePos >= this.sliceSlots[0].length) {
            this.slicePos = 0
        }

        // const chanceOfRandomSlot = 0.15

        let slotIndex = 0


        const slices = this.sliceSlots[slotIndex]


        let sliceIndex = this.slicePositions[this.slicePos]


        const slice = slices[sliceIndex]

        // let rate = 1

        // const chanceOfRandomPitch = 0.1

        // const rnd = Math.random()
        // if (rnd < chanceOfRandomPitch) {
        //     rate = 0.5
        // }
        // else if (rnd < chanceOfRandomPitch * 2) {
        //     rate = 2
        // }


        this.playerNode = playBufferSync(this.context, slice, 1, () => {
            this.slicePos += 1
            this._playNextSlice()
        })


    }


}

