function defaultAppState(gameKey) {
  var appState = {};
  appState.entries = [];
  appState.teams = [createTeam("Team Red", "red"), createTeam("Team Blue", "blue")];
  appState.rounds = createRoundsInfo();
  appState.turnState = createTurnState();
  appState.gameState = createGameState(gameKey);

  return appState;
}

function createTeam(name, color) {
  var team = {};
  team.name = name;
  team.color = color;
  team.players = [];
  team.playerIndex = 0;
  return team;
}

function createRoundsInfo() {
  return [createRoundInfo("Round 1 - Tabou Rules:<br>Just don't say the current word.", 30),
          createRoundInfo("Round 2 - Charade Rules:<br>Act it out. No talking!", 30),
          createRoundInfo("Round 3 - Password Rules:<br>Say just one word.", 15)
  ];
}

function createRoundInfo(description, roundLength) {
  var roundInfo = {};
  roundInfo.desc = description;
  roundInfo.roundLength = roundLength;
  return roundInfo
}

function createTurnState() {
  var turnState = {};
  turnState.teamIndex = Math.floor(Math.random() * 2);
  turnState.timeLeft = 30;
  turnState.isRunning = false;

  return turnState;
}

function createGameState(gameKey) {
  var gameState = {};
  gameState.started = false;
  gameState.formCount = 3;
  gameState.key = gameKey;

  return gameState;
}

function createLocalTurnState(appState){
  var localTurnState = appState.turnState;
  
  localTurnState.data = shuffledTurnData(appState);
  localTurnState.index = 0;
  localTurnState.round = getCurrentRound(appState);
  
  return localTurnState;
}

function shuffledTurnData(appState) {
  return shuffle(currentTurnData(appState));
}

function currentTurnData(appState) {
  var currentRound = getCurrentRound(appState);
  var turnData = [];
  for (var i = 0; i < appState.entries.length; i++) {
    var gameEntry = appState.entries[i];
    if (gameEntry.guessers[currentRound] == "") {
      turnData.push(createTurnDataEntry(gameEntry.word, i));
    }
  }
  return turnData;
}

function createTurnDataEntry(word, gameIndex) {
  var turnEntry = {};
  turnEntry.word = word;
  turnEntry.gameIndex = gameIndex;
  turnEntry.guessed = false;
  turnEntry.skipped = false;
  return turnEntry;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}