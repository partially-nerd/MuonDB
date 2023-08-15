const $ = x => document.querySelectorAll(x)

String.prototype.truncate = String.prototype.truncate || 
function ( n, useWordBoundary ){
  if (this.length <= n) { return this; }
  const subString = this.slice(0, n-1);
  return (useWordBoundary 
    ? subString.slice(0, subString.lastIndexOf(" ")) 
    : subString) + "...";
};


function fillRecents() {
  recents = JSON.parse(localStorage.getItem("recents")) || [];
  for (let i = recents.length - 1; i > -1; i--) {
    console.log(recents);
    const item = recents[recents.length - 1 - i];
    const element = $(".card")[i];
    element.style = `--label: '${item.truncate(20)}'`;
    element.setAttribute("dir", item);
  }
}

function submit(dir) {
  recents = JSON.parse(localStorage.getItem('recents')) || [];
  if (recents.includes(dir)) {
    recents = recents.filter(x => x !== dir);
    recents.push(dir);
    localStorage.setItem("recents", JSON.stringify(recents));
    location.href = "app/edit.html";
    return;
  }
  if (recents.length == 4) {
    recents = recents.filter(x => x !== recents[0]);
  }
  recents.push(dir);
  localStorage.setItem("recents", JSON.stringify(recents));
  location.href = "app/edit.html";
}