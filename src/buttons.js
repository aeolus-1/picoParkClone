class Button {
    constructor(pos,options) {
        options = {

            onPress:()=>{},
            onPlayer:()=>{},
            onUnpress:()=>{},

            ...options,


        }
        this.pos = pos
        
        
        this.onIn = (e)=>{
            options.onPlayer(e)
        }
        this.onPress = options.onPress
        this.onUnpress = options.onUnpress
        
        


    }
}