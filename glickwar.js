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
let user_hand = []
let opponent_hand = []
let number_of_user_bets_this_round = 0
let number_of_opponent_bets_this_round = 0
let is_artificial_intelligence_on = false
const CARDS_DEALT_PER_PLAYER = 10
const BETS_PER_ROUND_PER_PLAYER = 3
const MAXIMUM_VALUE_THAT_AI_WILL_BET_AGAINST = 10
const CARD_WIDTH = 150
const CARD_HEIGHT = 225
const OPACITY_LEVEL_FOR_GREYED_OUT_CARD = 0.4

function toggle_artificial_intelligence() {
    document.getElementById("network_gif").hidden = !document.getElementById("network_gif").hidden
    is_artificial_intelligence_on = !is_artificial_intelligence_on
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
    _deal_cards_to(user_cards_left)
    _deal_cards_to(opponent_cards_left)
    document.getElementById("user_cards_left").innerHTML = user_cards_left.length.toString()
    document.getElementById("opponent_cards_left").innerHTML = opponent_cards_left.length.toString()
    document.getElementById("play_next_hand_button").disabled = false
    document.getElementById("toggle_artificial_intelligence_button").disabled = false
    document.getElementById("celebration_gif").hidden = true
    document.getElementById("embarrassed_gif").hidden = true
}

function _deal_cards_to(player_deck) {
    for (let i = 1; i <= CARDS_DEALT_PER_PLAYER; i++) {
        let index_of_card_to_deal = Math.floor(Math.random() * game_deck.length)
        player_deck.push(game_deck[index_of_card_to_deal])
        game_deck.splice(index_of_card_to_deal, 1)
    }
}

async function play_next_hand() {
    if (user_hand.length > 0) {
        _handle_hand_winner()
    }
    if (user_cards_left.length === 0 || opponent_cards_left.length === 0) {
        _handle_game_winner()
        return
    }
    _clear_played_cards()
    await _wait_one_second()
    _play_opponent_card()
    _play_user_card()
    document.getElementById("bet_another_card_button").disabled = false
    number_of_user_bets_this_round = 0
    number_of_opponent_bets_this_round = 0
}

function _play_user_card() {
    if (user_cards_left.length > 0) {
        let user_card = user_cards_left.pop()
        user_hand.push(user_card)
        let card_element = document.createElement("IMG")
        card_element.className = "played_card played_user_card"
        card_element.src = `images/${user_card}.png`
        card_element.width = 150
        card_element.height = 225
        document.getElementById("user_hand").appendChild(card_element)
        document.getElementById("user_cards_left").innerHTML = user_cards_left.length.toString()
        if (is_artificial_intelligence_on === true) {
            _run_artificial_intelligence()
        }
    }
}

function _play_opponent_card() {
    if (opponent_cards_left.length > 0) {
        let opponent_card = opponent_cards_left.pop()
        opponent_hand.push(opponent_card)
        let card_element = document.createElement("IMG")
        card_element.className = "played_card played_opponent_card"
        card_element.src = `images/${opponent_card}.png`
        card_element.width = CARD_WIDTH
        card_element.height = CARD_HEIGHT
        document.getElementById("opponent_hand").appendChild(card_element)
        document.getElementById("opponent_cards_left").innerHTML = opponent_cards_left.length.toString()
    }
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

function _bet_opponent_card() {
    number_of_opponent_bets_this_round++
    _play_opponent_card()
    let penultimate_played_opponent_card = document.getElementsByClassName("played_opponent_card")[document.getElementsByClassName("played_opponent_card").length - 2]
    penultimate_played_opponent_card.style.opacity = OPACITY_LEVEL_FOR_GREYED_OUT_CARD
}

async function _run_artificial_intelligence() {
    for (let i = 0; i < BETS_PER_ROUND_PER_PLAYER; i++) {
        if (number_of_opponent_bets_this_round < BETS_PER_ROUND_PER_PLAYER && _get_last_played_value_by_hand(user_hand) > _get_last_played_value_by_hand(opponent_hand) && _get_last_played_value_by_hand(user_hand) <= MAXIMUM_VALUE_THAT_AI_WILL_BET_AGAINST) {
            await _wait_one_second()
            _bet_opponent_card()
        }
    }
}

function _get_last_played_value_by_hand(hand) {
    let last_played_card_by_hand = hand[hand.length - 1]
    return parseInt(last_played_card_by_hand.replace(last_played_card_by_hand.charAt(last_played_card_by_hand.length - 1), ""))
}

function _clear_played_cards() {
    user_hand = []
    opponent_hand = []
    let played_cards_elements = document.getElementsByClassName("played_card")
    while (played_cards_elements.length > 0) {
        played_cards_elements[0].parentNode.removeChild(played_cards_elements[0])
    }
}

function _handle_hand_winner() {
    let user_last_played_value = _get_last_played_value_by_hand(user_hand)
    let opponent_last_played_value = _get_last_played_value_by_hand(opponent_hand)
    if (user_last_played_value > opponent_last_played_value) {
        for (let i = 0; i < user_hand.length; i++) {
            user_cards_left.unshift(user_hand[i])
        }
        for (let i = 0; i < opponent_hand.length; i++) {
            user_cards_left.unshift(opponent_hand[i])
        }
        _announce_user_winnings()
    } else if (user_last_played_value < opponent_last_played_value) {
        for (let i = 0; i < user_hand.length; i++) {
            opponent_cards_left.unshift(user_hand[i])
        }
        for (let i = 0; i < opponent_hand.length; i++) {
            opponent_cards_left.unshift(opponent_hand[i])
        }
        _announce_opponent_winnings()
    } else if (user_hand.length > 0) {
        for (let i = 0; i < user_hand.length; i++) {
            user_cards_left.unshift(user_hand[i])
        }
        for (let i = 0; i < opponent_hand.length; i++) {
            opponent_cards_left.unshift(opponent_hand[i])
        }
    }
}

async function _announce_user_winnings() {
    document.getElementById("user_cards_left").innerHTML = `+${opponent_hand.length}`
    document.getElementById("user_cards_left").style.fontSize = "48"
    document.getElementById("user_cards_left").style.color = "green"
    await _wait_one_second()
    document.getElementById("user_cards_left").innerHTML = user_cards_left.length.toString()
    document.getElementById("user_cards_left").style.fontSize = ""
    document.getElementById("user_cards_left").style.color = "black"
}

async function _announce_opponent_winnings() {
    document.getElementById("opponent_cards_left").innerHTML = `+${user_hand.length}`
    document.getElementById("opponent_cards_left").style.fontSize = "48"
    document.getElementById("opponent_cards_left").style.color = "green"
    await _wait_one_second()
    document.getElementById("opponent_cards_left").innerHTML = opponent_cards_left.length.toString()
    document.getElementById("opponent_cards_left").style.fontSize = ""
    document.getElementById("opponent_cards_left").style.color = ""
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
    document.getElementById("toggle_artificial_intelligence_button").disabled = true
}

async function _wait_one_second() {
    await new Promise(r => setTimeout(r, 1000))
}