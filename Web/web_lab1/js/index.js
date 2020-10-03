function store() {
    var inp = document.getElementById("inp")
    console.log("Inp: " + inp.value)
    localStorage["tetris.username"] = inp.value

    console.log("Saved:" + localStorage["tetris.username"])
    console.log("Redirecting")
    window.location = "../html/game.html";
}

function redirect(){
 //   console.log("red")
}

function restore() {
    var inp = document.getElementById("inp")
    if (localStorage.hasOwnProperty("tetris.username")){
        inp.value = localStorage.getItem("tetris.username");
        console.log("Name restored")
    }else{
        console.log("No name stored!")
    }
}

