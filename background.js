
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          //hostEquals: 'developer.chrome.com'
          schemes: ['http', 'https', 'chrome', 'brave', '*']
        },
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
    
  });
  
  