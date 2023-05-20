class Button {
    constructor(pos,options) {
        options = {

            onPress:()=>{},
            onPlayer:()=>{},

            ...options,


        }
        this.pos = pos
        
        
        this.onIn = (e)=>{
            options.onPlayer(e)
        }
        this.onPress = options.onPress
        
        


    }
}