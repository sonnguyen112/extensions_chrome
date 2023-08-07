var PREVCONTENT = ""

function getText() {
    return document.body.innerText;
}

function replaceText(oldWord, newWord) {
    // Save selection
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    console.log("Range")
    console.log(range)
    if (range){
        var startContainer = range.startContainer
        var startOffset = range.startOffset
        var endContainer = range.endContainer
        var endOffset = range.endOffset
    }

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
        console.log("Backup range")
        console.log(backUpRange)
        selection.addRange(backUpRange);
    }
}


function badWordProcessReplace(listSentence){
    var result = []

    // your code

    result = ["dm", "dit me"]
    for (var i = 0; i < result.length; i++){
        replaceText(result[i], "*".repeat(result[i].length))
    }
}

setInterval(function () {
    if (chrome.runtime) {
        chrome.runtime.sendMessage({ cmd: "getState" }, function (response) {

            var state = response.val
            console.log(state)
            if (state === "ON") {
                var allText = getText()
                if (allText !== PREVCONTENT){
                    // console.log(allText)
                    PREVCONTENT = allText
                    var textList = allText.split("\n")
                    var textListAlpha = []
                    for (var i = 0; i < textList.length; i++) {
                        if (/^[ ]*$/.test(textList[i]) == false) {
                            textListAlpha.push(textList[i])
                        }
                    }
                    badWordProcessReplace(textListAlpha)
                }
            }
        });
    }
}, 1000);