const $ = x => document.querySelectorAll(x);
const recents = JSON.parse(localStorage.getItem("recents"));
const directory = recents[recents.length - 1];

function getNodeIndex(element) {
    return Array.from(element.parentNode.childNodes).indexOf(element);
}

function setVal(e) {
    that = document.activeElement;
    that.setAttribute('value', that.value);
}

function csv_key_up(e) {
    if (e.key != "Enter") return;
    that = document.activeElement;
    i = getNodeIndex(that.parentElement.parentElement);
    console.log(i);
    row = document.createElement("tr");
    for (let j = 0; j < Array.from($("tr")[0].children).length; j++) {
        cell = document.createElement("td");
        cell = document.createElement("td");
        input = document.createElement("input");
        cell.append(input);
        row.append(cell);
        if (j != fields.length - 1) continue;
        input.addEventListener("keyup", csv_key_up)
    }
    $(".editor-like")[0].insertBefore(row, $("tr")[i + 1])
}

function openFile(e) {
    if (this.file.includes(".json")) {
        $(".editor-wrapper")[0].innerHTML = '<pre class="editor" class="nohighlight" contenteditable="" onkeyup="highlight(event)"></pre><pre class="editor-behind"><code class="language-json"></code></pre>'
        $(".editor")[0].innerHTML = api.read(this.file);
        activeFile = this.file;
        $(".language-json")[0].innerHTML = $(".editor")[0].innerHTML;
        hljs.highlightElement($(".language-json")[0]);
    }
    else {
        activeFile = this.file;
        $(".editor-wrapper")[0].innerHTML = '<table class="editor-like"></table>';
        readed = api.read(this.file).split("\n");
        for (let j = 0; j < readed.length; j++) {
            const line = readed[j];
            row = document.createElement("tr");
            fields = line.split(",");
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                if (field == "" || field == " ") continue;
                cell = document.createElement("td");
                input = document.createElement("input");
                input.addEventListener("keydown", setVal);
                input.setAttribute('value', field);
                input.value = field;
                cell.append(input);
                row.append(cell);
                if (i != fields.length - 1) continue;
                input.addEventListener("keyup", csv_key_up);
            };
            $(".editor-like")[0].append(row);
        }
    }
}

function newFile(e) {
    if (e.key == "Enter") {
        api.write(directory + "/" + document.activeElement.value, "{\n\n\n}");
        fillExplorer();
    }
}

function saveFile(e) {
    if (activeFile.includes(".json")) {
        api.write(activeFile, $(".editor")[0].innerHTML);
    }
    else {
        csv = "";
        $("tr").forEach(row => {
            Array.from(row.childNodes).forEach(cell => {
                csv += cell.childNodes[0].value + ",";
            })
            csv += "\n";
        });
        api.write(activeFile, csv);
    }
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
        if (activeFile.includes(".json")) {
            $(".language-json")[0].innerHTML = $(".language-json")[0].innerHTML.replace(document.activeElement.value, `>>>>>>>>>>${document.activeElement.value}`);
            setTimeout(() => {
                $(".language-json")[0].innerHTML = $(".language-json")[0].innerHTML.replace(">>>>>>>>>>", "");
            }, 2000);
        } else {
            console.log($(".editor-like")[0].innerHTML);
            $(".editor-like")[0].innerHTML = $(".editor-like")[0].innerHTML.replace(document.activeElement.value, `>>>>>>>>>>${document.activeElement.value}`);
            setTimeout(() => {
                $(".editor-like")[0].innerHTML = $(".editor-like")[0].innerHTML.replace(">>>>>>>>>>", "");
            }, 2000);
        }
    }
}