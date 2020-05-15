function resetAppState(gameKey) {
  var lock = LockService.getScriptLock();
  var success = lock.tryLock(10000);
  if (!success) {
    Logger.log('Could not obtain lock after 10 seconds.');
    return false;
  }
  
  var newAppState = defaultAppState(gameKey);
  var newDataString = JSON.stringify(newAppState);
  
  var sp = PropertiesService.getScriptProperties();
  sp.setProperty(dataKey(), newDataString);
  setCachedData(newDataString);
  
  lock.releaseLock();
  return newDataString;
}

function getAppStateAsString() {
  var cached = getCachedData();
  if( cached != null ) {
    return cached;
  } 
  
  var lock = LockService.getScriptLock();
  var lockSuccess = lock.tryLock(2000); // 2 seconds
  
  var sp = PropertiesService.getScriptProperties();
  var dataString = sp.getProperty(dataKey());
  
  if( !dataString ) {
    var emptyGameKey = "";
    var appState = defaultAppState(emptyGameKey);
    dataString = JSON.stringify(appState);
  }
  
  if (lockSuccess) {
    setCachedData(dataString);
  } else {
    Logger.log("Could not obtain lock to update cache"); 
  }
  
  lock.releaseLock();
  return dataString;
}

function setAppState(data) {
  var sp = PropertiesService.getScriptProperties();
  var oldDataString = sp.getProperty(dataKey());
  
  var lock = LockService.getScriptLock();
  var success = lock.tryLock(10000);
  if (!success) {
    Logger.log('Could not obtain lock after 10 seconds.');
    return oldDataString;
  }
  
  var newDataString = JSON.stringify(data);
  sp.setProperty(dataKey(), newDataString);
  setCachedData(newDataString);
  
  lock.releaseLock();
  
  Logger.log('newDataString', newDataString);
  return newDataString;
}

function addEntries(newEntries) {  
  var lock = LockService.getScriptLock();
  var success = lock.tryLock(10000);
  if (!success) {
    Logger.log('addEntry could not obtain lock after 10 seconds.');
    return null;
  }
  
  var sp = PropertiesService.getScriptProperties();
  var appDataString = sp.getProperty(dataKey());
  if( !appDataString ) {
    lock.releaseLock();
    return null; 
  }
  
  var appData = JSON.parse(appDataString);
  if( appData.gameState.started ) {
     Logger.log('addEntry, game has already started', appData);
     return null;
  }
  
  var words = [];
  for( var i = 0; i < newEntries.length; i++ ) {
    words.push(newEntries[i].word);
    appData.entries.push(newEntries[i]);
  }

  var newDataString = JSON.stringify(appData);
  sp.setProperty(dataKey(), newDataString);
  setCachedData(newDataString);
  
  lock.releaseLock();
  
  return words;
}

function startTurn() {  
  var lock = LockService.getScriptLock();
  var success = lock.tryLock(10000);
  if (!success) {
    Logger.log('startTurn could not obtain lock after 10 seconds.');
    return null;
  }
  
  var sp = PropertiesService.getScriptProperties();
  var appDataString = sp.getProperty(dataKey());
  if( !appDataString ) {
    lock.releaseLock();
    return null; 
  }
  
  ///////////////////////////////////////////////////
  //
  var appData = JSON.parse(appDataString);
  
  if( appData.turnState.isRunning ) {
    lock.releaseLock();
    return null; 
  }

  appData.turnState.isRunning = true;
  //////////////////////////////////////////////////
  
  var newDataString = JSON.stringify(appData);
  sp.setProperty(dataKey(), newDataString);
  setCachedData(newDataString);
  
  lock.releaseLock();
  return createLocalTurnState(appData);
}

function endTurn(localTurnState) {  
  var lock = LockService.getScriptLock();
  var success = lock.tryLock(10000);
  if (!success) {
    Logger.log('endTurn could not obtain lock after 10 seconds.');
    return null;
  }
  
  var sp = PropertiesService.getScriptProperties();
  var appDataString = sp.getProperty(dataKey());
  if( !appDataString ) {
    lock.releaseLock();
    return null; 
  }
  
  /////////////////////////////////
  //
  var appData = JSON.parse(appDataString);
  Logger.log(appData);
  Logger.log(localTurnState);
  
  var teamName = appData.teams[localTurnState.teamIndex].name;
  var skipped = false;
  
  for( var i = 0; i < localTurnState.data.length; i++ ){
    if( localTurnState.data[i].guessed ) {
      var gameIndex = localTurnState.data[i].gameIndex;
      appData.entries[gameIndex].guessers[localTurnState.round] = teamName;
    }
    
    if( localTurnState.data[i].skipped ) {
      skipped = true;
    }
  }

  if( skipped ){
    localTurnState.timeLeft = 0;
  }
  
  var roundLength = 30;
  var currentRound = getCurrentRound(appData);
  if( currentRound >= 0 ) {
    roundLength = appData.rounds[currentRound].roundLength;
  }
  
  if( currentRound < 0 ) {
    appData.turnState.isRunning = false;
  } else if( localTurnState.timeLeft <= 0 ) {
    var currentTeamIndex = appData.turnState.teamIndex;
    var currentTeam = appData.teams[ currentTeamIndex ];
    if( currentTeam.players.length > 0 ){
      appData.teams[ currentTeamIndex ].playerIndex = (currentTeam.playerIndex + 1) % currentTeam.players.length;
    }
    appData.turnState.teamIndex = (appData.turnState.teamIndex + 1) % 2;
    appData.turnState.timeLeft = roundLength;
    appData.turnState.isRunning = false;
  } else {
    appData.turnState.timeLeft = Math.min(localTurnState.timeLeft,roundLength);
    appData.turnState.isRunning = true;
  }
  
  
  Logger.log(appData);
  
  /////////////////

  var newDataString = JSON.stringify(appData);
  sp.setProperty(dataKey(), newDataString);
  setCachedData(newDataString);
  
  lock.releaseLock();
  
  if( appData.turnState.isRunning ){
    return createLocalTurnState(appData);
  } else {
    return null;
  }
}

function startGame() {  
  var lock = LockService.getScriptLock();
  var success = lock.tryLock(10000);
  if (!success) {
    Logger.log('startGame could not obtain lock after 10 seconds.');
    return false;
  }
  
  var sp = PropertiesService.getScriptProperties();
  var appDataString = sp.getProperty(dataKey());
  if( !appDataString ) {
    lock.releaseLock();
    return false; 
  }
  
  ///////////////////////////////////////////////////
  //
  var appData = JSON.parse(appDataString);
  
  if( appData.entries.length <= 0 ) {
    lock.releaseLock();
    return false; 
  }

  appData.gameState.started = true;
  //////////////////////////////////////////////////
  
  var newDataString = JSON.stringify(appData);
  sp.setProperty(dataKey(), newDataString);
  setCachedData(newDataString);
  
  lock.releaseLock();
  return true;
}

function enterGame(gameKey) {
  var dataString = getCachedData();
  if( dataString == null ) {
    var sp = PropertiesService.getScriptProperties();
    var dataString = sp.getProperty(dataKey());
  } 
  
  if( dataString == null ) {
    return ""; 
  }
  
  var appData = JSON.parse(dataString);
  if( appData.gameState.key == gameKey ){
    return gameKey; 
  } 
  
  return ""; 
}

function createGame(gameKey, players, startingTeamIndex) {  
  var lock = LockService.getScriptLock();
  var success = lock.tryLock(10000);
  if (!success) {
    Logger.log('Could not obtain lock after 10 seconds.');
    return false;
  }
  
  var newAppState = defaultAppState(gameKey);
  newAppState.teams[0].players = players[0];
  newAppState.teams[1].players = players[1];
  newAppState.turnState.teamIndex = startingTeamIndex;
  
  var newDataString = JSON.stringify(newAppState);
 
  var sp = PropertiesService.getScriptProperties();
  sp.setProperty(dataKey(), newDataString);
  setCachedData(newDataString);
  
  lock.releaseLock();
  return newDataString;
}