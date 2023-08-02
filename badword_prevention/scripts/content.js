function getText() {
    return document.body.innerText;
}

function replaceText(oldWord, newWord) {
    // Save selection
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    console.log("Range")
    console.log(range)
    var startContainer = range.startContainer
    var startOffset = range.startOffset
    var endContainer = range.endContainer
    var endOffset = range.endOffset
    
    // Replace text
    const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (treeWalker.nextNode()) {
        textNodes.push(treeWalker.currentNode);
    }
    let regex = new RegExp(oldWord, "g");
    for (const textNode of textNodes) {
        textNode.nodeValue = textNode.nodeValue.replace(regex, newWord);
    }

    // Restore selection
    if (range) {
        console.log("Restore range")
        var backUpRange = document.createRange()
        backUpRange.setStart(startContainer, startOffset)
        backUpRange.setEnd(endContainer, endOffset)
        selection.removeAllRanges();
        selection.addRange(backUpRange);
    }
}

function modelSimulator(word){
    var modelSimulatorMap = {
        "dm": "***",
        "dit me m": "*** m"
    }

    var wordProcessed = word.toLowerCase()

    if (wordProcessed in modelSimulatorMap){
        replaceText(wordProcessed, modelSimulatorMap[wordProcessed])
    }
    console.log("done")
}

setInterval(function () {
    if (chrome.runtime) {
        chrome.runtime.sendMessage({ cmd: "getState" }, function (response) {

            var state = response.val
            console.log(state)
            if (state === "ON") {
                var allText = getText()
                // console.log(allText)
                var textList = allText.split("\n")
                var textListAlpha = []
                for (var i = 0; i < textList.length; i++) {
                    if (/^[ ]*$/.test(textList[i]) == false) {
                        textListAlpha.push(textList[i])
                    }
                }
                console.log(textListAlpha)
                for (var i = 0; i < textListAlpha.length; i++) {
                    modelSimulator(textListAlpha[i])
                }
            }
        });
    }
}, 2000);