let game_deck = [
    "1C", "1D", "1H", "1S",
    "2C", "2D", "2H", "2S",
    "3C", "3D", "3H", "3S",
    "4C", "4D", "4H", "4S",
    "5C", "5D", "5H", "5S",
    "6C", "6D", "6H", "6S",
    "7C", "7D", "7H", "7S",
    "8C", "8D", "8H", "8S",
    "9C", "9D", "9H", "9S",
    "10C", "10D", "10H", "10S",
    "11C", "11D", "11H", "11S",
    "12C", "12D", "12H", "12S",
    "13C", "13D", "13H", "13S"
]
let user_cards_left = []
let opponent_cards_left = []
let user_played_cards = []
let opponent_played_cards = []
let number_of_user_bets_this_round = 0
let number_of_opponent_bets_this_round = 0
let opponent_ai_is_on = false
const OPACITY_LEVEL_FOR_GREYED_OUT_CARD = 0.4

function toggle_opponent_ai() {
    document.getElementById("network_gif").hidden = !document.getElementById("network_gif").hidden
    opponent_ai_is_on = !opponent_ai_is_on
}

function start_new_game() {
    game_deck = [
        "1C", "1D", "1H", "1S",
        "2C", "2D", "2H", "2S",
        "3C", "3D", "3H", "3S",
        "4C", "4D", "4H", "4S",
        "5C", "5D", "5H", "5S",
        "6C", "6D", "6H", "6S",
        "7C", "7D", "7H", "7S",
        "8C", "8D", "8H", "8S",
        "9C", "9D", "9H", "9S",
        "10C", "10D", "10H", "10S",
        "11C", "11D", "11H", "11S",
        "12C", "12D", "12H", "12S",
        "13C", "13D", "13H", "13S"
    ]
    user_cards_left = []
    opponent_cards_left = []
    _clear_played_cards()
    _deal_26_cards_to(user_cards_left)
    _deal_26_cards_to(opponent_cards_left)
    document.getElementById("user_cards_left").innerHTML = user_cards_left.length.toString()
    document.getElementById("opponent_cards_left").innerHTML = opponent_cards_left.length.toString()
    document.getElementById("play_next_hand_button").disabled = false
    document.getElementById("toggle_opponent_ai_button").disabled = false
    document.getElementById("celebration_gif").hidden = true
    document.getElementById("embarrassed_gif").hidden = true
}

async function play_next_hand() {
    if (user_played_cards.length > 0) {
        _handle_hand_winner()
    }
    console.log([user_cards_left, opponent_cards_left])
    if (user_cards_left.length === 0 || opponent_cards_left.length === 0) {
        _handle_game_winner()
        return
    }
    _clear_played_cards()
    await new Promise(r => setTimeout(r, 1000))
    _play_opponent_card()
    _play_user_card()
    document.getElementById("bet_another_card_button").disabled = false
    number_of_user_bets_this_round = 0
    number_of_opponent_bets_this_round = 0
}

function bet_user_card() {
    _play_user_card()
    number_of_user_bets_this_round++
    if (number_of_user_bets_this_round === 3) {
        document.getElementById("bet_another_card_button").disabled = true
    }
    let penultimate_played_user_card = document.getElementsByClassName("played_user_card")[document.getElementsByClassName("played_user_card").length - 2]
    penultimate_played_user_card.style.opacity = OPACITY_LEVEL_FOR_GREYED_OUT_CARD
}

function _deal_26_cards_to(player_deck) {
    for (let i = 1; i < 11; i++) {
        let card_index = Math.floor(Math.random() * game_deck.length)
        player_deck.push(game_deck[card_index])
        game_deck.splice(card_index, 1)
    }
}

function _play_user_card() {
    if (user_cards_left.length > 0) {
        let user_card = user_cards_left.pop()
        user_played_cards.push(user_card)
        let card_element = document.createElement("IMG")
        card_element.className = "played_card played_user_card"
        card_element.src = `images/${user_card}.png`
        card_element.width = 150
        card_element.height = 225
        document.getElementById("user_played_cards").appendChild(card_element)
        document.getElementById("user_cards_left").innerHTML = user_cards_left.length.toString()
        if (opponent_ai_is_on === true) {
            _run_opponent_ai()
        }
    }
}

function _play_opponent_card() {
    if (opponent_cards_left.length > 0) {
        let opponent_card = opponent_cards_left.pop()
        opponent_played_cards.push(opponent_card)
        let card_element = document.createElement("IMG")
        card_element.className = "played_card played_opponent_card"
        card_element.src = `images/${opponent_card}.png`
        card_element.width = 150
        card_element.height = 225
        document.getElementById("opponent_played_cards").appendChild(card_element)
        document.getElementById("opponent_cards_left").innerHTML = opponent_cards_left.length.toString()
    }
}

async function _run_opponent_ai() {
    for (let i = 0; i < 3; i++) {
        if (number_of_opponent_bets_this_round < 3 && _get_last_played_value(user_played_cards) > _get_last_played_value(opponent_played_cards) && _get_last_played_value(user_played_cards) < 11) {
            await new Promise(r => setTimeout(r, 1000))
            _bet_opponent_card()
        }
    }
}

function _bet_opponent_card() {
    number_of_opponent_bets_this_round++
    _play_opponent_card()
    let penultimate_played_opponent_card = document.getElementsByClassName("played_opponent_card")[document.getElementsByClassName("played_opponent_card").length - 2]
    penultimate_played_opponent_card.style.opacity = OPACITY_LEVEL_FOR_GREYED_OUT_CARD
}

function _get_last_played_value(player_played_cards) {
    let player_last_played_card = player_played_cards[player_played_cards.length - 1]
    return parseInt(player_last_played_card.replace(player_last_played_card.charAt(player_last_played_card.length - 1), ""))
}

function _clear_played_cards() {
    user_played_cards = []
    opponent_played_cards = []
    let played_cards_elements = document.getElementsByClassName("played_card")
    while (played_cards_elements.length > 0) {
        played_cards_elements[0].parentNode.removeChild(played_cards_elements[0])
    }
}

function _handle_hand_winner() {
    let user_last_played_value = _get_last_played_value(user_played_cards)
    let opponent_last_played_value = _get_last_played_value(opponent_played_cards)
    if (user_last_played_value > opponent_last_played_value) {
        for (let i = 0; i < user_played_cards.length; i++) {
            user_cards_left.unshift(user_played_cards[i])
        }
        for (let i = 0; i < opponent_played_cards.length; i++) {
            user_cards_left.unshift(opponent_played_cards[i])
        }
        _emphasize_updated_user_cards_left();
    } else if (user_last_played_value < opponent_last_played_value) {
        for (let i = 0; i < user_played_cards.length; i++) {
            opponent_cards_left.unshift(user_played_cards[i])
        }
        for (let i = 0; i < opponent_played_cards.length; i++) {
            opponent_cards_left.unshift(opponent_played_cards[i])
        }
        _emphasize_updated_opponent_cards_left()
    } else if (user_played_cards.length > 0) {
        for (let i = 0; i < user_played_cards.length; i++) {
            user_cards_left.unshift(user_played_cards[i])
        }
        for (let i = 0; i < opponent_played_cards.length; i++) {
            opponent_cards_left.unshift(opponent_played_cards[i])
        }
    }
}

async function _emphasize_updated_user_cards_left() {
    document.getElementById("user_cards_left").innerHTML = `+${opponent_played_cards.length}`
    document.getElementById("user_cards_left").style.fontSize = "48"
    document.getElementById("user_cards_left").style.color = "green"
    await new Promise(r => setTimeout(r, 1000))
    document.getElementById("user_cards_left").innerHTML = user_cards_left.length.toString()
    document.getElementById("user_cards_left").style.fontSize = ""
    document.getElementById("user_cards_left").style.color = "black"
}

async function _emphasize_updated_opponent_cards_left() {
    document.getElementById("opponent_cards_left").innerHTML = `+${user_played_cards.length}`
    document.getElementById("opponent_cards_left").style.fontSize = "48"
    document.getElementById("opponent_cards_left").style.color = "green"
    await new Promise(r => setTimeout(r, 1000))
    document.getElementById("opponent_cards_left").innerHTML = opponent_cards_left.length.toString()
    document.getElementById("opponent_cards_left").style.fontSize = ""
    document.getElementById("opponent_cards_left").style.color = "black"
}

function _handle_game_winner() {
    if (opponent_cards_left.length === 0) {
        alert("You won!")
        document.getElementById("celebration_gif").hidden = false
    } else if (user_cards_left.length === 0) {
        alert("You lost!")
        document.getElementById("embarrassed_gif").hidden = false
    }
    document.getElementById("play_next_hand_button").disabled = true
    document.getElementById("bet_another_card_button").disabled = true
    document.getElementById("toggle_opponent_ai_button").disabled = true
}