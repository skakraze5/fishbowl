function defaultAppState() {
  var appState = {};
  appState.entries = [];
  appState.teams = [createTeam("Team Red", "red"), createTeam("Team Blue", "blue")];
  appState.rounds = createRoundsInfo();
  appState.turnState = createTurnState();
  appState.gameState = createGameState();

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

function createGameState() {
  var gameState = {};
  gameState.started = false;
  gameState.formCount = 3;
  gameState.key = "";

  return gameState;
}
