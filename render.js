function renderLoop() {
    renderLevel()
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        player.updatePlayerParts()

        renderPlayer(ctx,player)

    }
}
function renderCheckLoop() {
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        player.updatePlayerParts()


    }
}

Matter.Events.on(render, "afterRender", renderLoop)
Matter.Events.on(render, "beforeRender", renderCheckLoop)


function renderPlayer(ctx, player) {
    ctx.save()
    var playerPos = player.body.position
    ctx.translate(playerPos.x,playerPos.y)
    ctx.scale(player.direction,1)
    ctx.translate(-playerPos.x,-playerPos.y)
    drawSprite(player.frame, player.body.position)

    ctx.restore()
}