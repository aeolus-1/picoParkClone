class SyncHandler {
    constructor(game, options) {
        this.game = game
        this.options = {
            
            
            ...options,
        }

        this.syncs = {}
    }
    addControl(label, getData, returnData) {
        this.syncs[label] = {
            label:label,
            getData:getData,
            returnData:returnData,
        }
    }
    getSyncData() {
        let retdata = {}
        for (let i = 0; i < Object.keys(this.syncs).length; i++) {
            const sync = this.syncs[Object.keys(this.syncs)[i]]
            
            retdata[sync.label] = sync.getData()
        }
        return retdata
    }
    processSyncData(ret) {
        
        let syncObjects = Object.keys(ret)
        for (let i = 0; i < syncObjects.length; i++) {
            const ob = ret[syncObjects[i]]
            let label = syncObjects[i]
            for (let j = 0; j < ob.length; j++) {
                const individualOb = ob[j];
                if (this.syncs[label]==undefined) {
                    console.error("syncs arn't aligned for ", label)
                } else {
                    this.syncs[label].returnData(individualOb)
                }
            }
            
        }
    }
}