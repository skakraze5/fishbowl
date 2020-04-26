function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');

  var htmlOutput = template.evaluate();
  htmlOutput.setTitle('Fish Bowl');
  htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  htmlOutput.setFaviconUrl('https://w0.pngwave.com/png/1005/738/computer-icons-fish-fish-bowl-png-clip-art-thumbnail.png');

  return htmlOutput;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent(); 
}

function includeTemplate(templateFilename) {
  return HtmlService.createTemplateFromFile(templateFilename).evaluate().getContent(); 
}
