function getCurrentRound(appState){
  for( var round = 0; round < appState.rounds.length; round++ ) {
    for( var i = 0; i < appState.entries.length; i++ ){
      if( appState.entries[i].guessers[round] == "" ) {
        return round;
      }
    }
  }  
  return -1;
}

function isGameOver(appState) {
  if( appState.entries.length == 0 ) {
    return false;
  }
  for( var round = 0; round < appState.rounds.length; round++ ) {
    for( var i = 0; i < appState.entries.length; i++ ){
      if( appState.entries[i].guessers[round] == "" ){
        return false;
      }
    }
  }
  return true;
}

function setCachedData(gameKey,dataString) {
  if( dataString != null ) {
    var cache = CacheService.getScriptCache();
    cache.put( dataKey(gameKey), dataString, 1500); // cache for 25 minutes
  }
}

function getCachedData(gameKey) {
  var cache = CacheService.getScriptCache();
  return cache.get( dataKey(gameKey) );
}

function environment(){
  var url = ScriptApp.getService().getUrl();
  return url.split( '/' )[6]; 
}

function dataKey(gameKey) {
  var key = environment() + gameKey + "key";
  return key;
}

function isValidGameKey(gameKey) {
  if(!gameKey){
    return false; 
  } else {
    return true; 
  }
}
