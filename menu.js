
function startGame() {
    document.getElementById("c").style.display = ""
    document.getElementById("menu").style.display = "none"
    if (!mainGame.matter.running) {
        startMainGame()
    }

}
function hideGame() {
    document.getElementById("menu").style.display = ""
    document.getElementById("c").style.display = "none"

}