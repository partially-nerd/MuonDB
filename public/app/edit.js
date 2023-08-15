const $ = x => document.querySelectorAll(x);
const recents = JSON.parse(localStorage.getItem("recents"));
const directory = recents[recents.length - 1];

function openFile(e) {
    $(".editor")[0].innerHTML = api.read(this.file);
    activeFile = this.file;
    $(".language-json")[0].innerHTML = $(".editor")[0].innerHTML;
    hljs.highlightElement($(".language-json")[0]);
}

function newFile(e) {
    if (e.key == "Enter") {
        api.write(directory + "/" + document.activeElement.value, "{\n\n\n}");
        fillExplorer();        
    }
}

function saveFile(e) {
    api.write(activeFile, $(".editor")[0].innerHTML);
}

function highlight(e) {
    $(".language-json")[0].innerHTML = $(".editor")[0].innerHTML;
    hljs.highlightElement($(".language-json")[0]);
}

function fillExplorer() {
    files = api.walk(directory);
    $(".explorer-btn").forEach(btn => {
        btn.remove();
    })
    files.forEach(file => {
        button = document.createElement("button");
        button.innerHTML = file.replace(directory, "");
        button.classList.add("explorer-btn");
        button.file = file
        button.addEventListener("click", openFile)
        $(".explorer")[0].append(button);
    });
}

function searchFor(e) {
    if (e.key == "Enter") {
        $(".language-json")[0].innerHTML = $(".language-json")[0].innerHTML.replace(document.activeElement.value, `>>>>>>>>>>${document.activeElement.value}`);
        setTimeout(() => {
            $(".language-json")[0].innerHTML = $(".language-json")[0].innerHTML.replace(">>>>>>>>>>", "");
        }, 2000);
    }
}