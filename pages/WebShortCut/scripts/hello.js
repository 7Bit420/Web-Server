
var state = JSON.parse(localStorage.getItem('nyt-wordle-state'))

if (confirm(state.solution)) {
    state.boardState[0] = state.solution
    localStorage.setItem('nyt-wordle-state',JSON.stringify(state))
    location.reload()
}
