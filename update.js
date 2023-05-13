function updateLoop() {
    updateControls()

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        player.updatePlayerParts()
        player.testFalling()
        
    }
    
}
Matter.Events.on(engine, "beforeUpdate", updateLoop)
