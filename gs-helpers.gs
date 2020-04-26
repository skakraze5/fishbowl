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

function setCachedData(dataString) {
  if( dataString != null ) {
    var cache = CacheService.getScriptCache();
    cache.put( dataKey(), dataString, 1500); // cache for 25 minutes
  }
}

function getCachedData() {
  var cache = CacheService.getScriptCache();
  return cache.get( dataKey() );
}

function environment(){
  var url = ScriptApp.getService().getUrl();
  return url.split( '/' )[6]; 
}

function dataKey() {
  var key = environment() + "key";
  return key;
}
