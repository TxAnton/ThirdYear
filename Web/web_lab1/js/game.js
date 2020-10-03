console.log("Here we go")

var field = document.getElementById("field")
var next_fig = document.getElementById("next_fig")
var f_ctx = field.getContext('2d');
var n_ctx = next_fig.getContext('2d');


function strcanv() {
    f_ctx.strokeRect(0, 0, field.width, field.height)
    n_ctx.strokeRect(0, 0, next_fig.width, next_fig.height)
}



var tetraminos = [
    [1, 1, 1, 1], //I
    [1, 1, 1, 0, //L
     1],
    [1, 1, 1, 0, //J
     0, 0, 1],
    [1, 1, 0, 0, //O
     1, 1],
    [1, 1, 0, 0, //Z
     0, 1, 1],
    [0, 1, 1, 0, //S
     1, 1],
    [0, 1, 0, 0, //T
     1, 1, 1]
];

var colors = ['#ff0000', '#00ff00', '#0000ff', '#00ffff',
    '#ff00ff', '#ffff00', '#ffaa00']

var bg_color = '#bebebe'
var stroke_color = '#000000'

var interval
var timeout

var player_name = localStorage.getItem("tetris.username");
var pscore = 0
var score = 0
var level = 0

var cell_size = 25

var n = 10
var m = 20
var fld = []


var cur
var next
var cur_x
var cur_y

var drop = false
function reset_fld() {

    for (var y = 0; y < m; ++y) {
        fld[y] = [];
        for (var x = 0; x < n; x++) {
            fld[y][x] = 0;
        }
    }
    /*
    for (var y=0; y<m; ++y) {
        fld[y] = [];
        for (var x=0; x<n; x++){
            fld[y][x] = ((x+y)%7)+1;
        }
    }
    */
}

function draw_cell(x, y, on_next_canvas = false) {
    if (on_next_canvas) {
        n_ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size)
        n_ctx.strokeRect(x * cell_size, y * cell_size, cell_size, cell_size)
    } else {
        f_ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size)
        f_ctx.strokeRect(x * cell_size, y * cell_size, cell_size, cell_size)
    }

}

function draw_fld() {
    field = document.getElementById("field")
    var f_ctx = field.getContext('2d');

    for (var y = 0; y < m; ++y) {
        for (var x = 0; x < n; x++) {
            if (fld[y][x]) {

                f_ctx.fillStyle = colors[fld[y][x] - 1]
                f_ctx.strokeStyle = stroke_color

            } else {
                f_ctx.fillStyle = bg_color
                f_ctx.strokeStyle = bg_color
            }
            draw_cell(x, y)

        }
    }
    //field = document.getElementById("field")
}

function get_rand_fig() {
    fig = []
    num = Math.floor(Math.random() * tetraminos.length);

    //num = 0
    tetr = tetraminos[num]
    for (var y = 0; y < 4; y++) {
        fig[y] = []
        for (var x = 0; x < 4; x++) {
            var i = 4 * y + x;
            if (tetr[i]) {
                fig[y][x] = num + 1;
            } else {
                fig[y][x] = 0;
            }
        }
    }
    return fig
}

function rotate_fig(fig){
    var rotated = []

    for (var y = 0; y < 4; y++) {
        rotated[y] = []
        for (var x = 0; x < 4; x++) {
            var i = 4 * y + x;
            rotated[y][x] = fig[3-x][y]
        }
    }
    return rotated
}

function cycle_fig() {
    if (next) {
        cur = next
    } else {
        cur = get_rand_fig()
    }
    next = get_rand_fig()

}

function draw_next_fig() {
    if (!next) {
        console.error("next fig not generated!")
        return
    }
    for (var y = 0; y < 4; ++y) {
        for (var x = 0; x < 4; x++) {
            if (next[y][x]) {
                n_ctx.fillStyle = colors[next[y][x] - 1]
                n_ctx.strokeStyle = stroke_color
            } else {
                n_ctx.fillStyle = bg_color
                n_ctx.strokeStyle = bg_color
            }
            draw_cell(x, y, true)
        }
    }
}

function draw_cur_fig() {
    if (!cur) {
        console.error("Cur figure not generated!")
        return
    }

    for (var y = 0; y < 4; ++y) {
        for (var x = 0; x < 4; x++) {
            if (cur[y][x]) {
                f_ctx.fillStyle = colors[cur[y][x] - 1]
                f_ctx.strokeStyle = stroke_color
                draw_cell(cur_x + x, cur_y + y, false)
            }

        }
    }
}

function loose() {

    console.log("Loose TODO")
    reset_fld()

    update_score()


    score=pscore=0
    level = 0
    clearInterval(interval)
    interval = setInterval(() =>iterate(),level_to_interval(level))
}

function is_cur_fit(pos_x, pos_y, fig = cur) {
    if(pos_x>=n || pos_y<0 || pos_y>=m){
        return false
    }
    if (fig) {
        for (var y = 0; y < 4; ++y) {
            for (var x = 0; x < 4; x++) {
                if (fig[y][x]) {
                    if(pos_x+x<0 || pos_x+x>=n || pos_y+y<0 || pos_y+y>=m){//Overboard
                        return false
                    }
                    if (fld[pos_y + y][pos_x + x]) {//Occupied
                        return false
                    }
                }
            }
        }
    } else {
        return false
    }
    return true
}

function clear_rows(){
    var s = 0
    for (var y = m-1; y> -1; y--) {
        var row_filled = true;
        for (var x = 0; x < n; x++) {
            if (fld[y][x] == 0) {
                row_filled = false;
                break;
            }
        }

        if (row_filled) {
            ++s;
            for (var yy = y; yy > 0; yy--) {
                for (var x = 0; x < n; x++) {
                    fld[yy][x] = fld[yy - 1][x];
                }
            }
            y++;
        }
    }
    return s;
}

function spawn_or_loose() {//Sets feasible cur_x for cur fig
    if (!cur) {
        console.error("Cur figure not generated!")
        return
    }
    cur_x = 0
    cur_y = 0

    b = false
    for (var x = 0; x <= n - 4; x++) {
        if (is_cur_fit(x, cur_y)) {
            b = true
            cur_x = x
            break;
        }
    }
    if (!b) {
        loose()
        return false
    }
    return true
}

function draw_grid(){
    for(var x = 0; x< n;++x){
        for(var y = 0;y<m;++y){
            f_ctx.strokeRect(x*cell_size, y*cell_size, cell_size, cell_size)
        }
    }


}

function render(b_fld = true, b_cur = true, c_next = true) {


    draw_fld()
    draw_cur_fig()
    draw_next_fig()
    strcanv()
    draw_grid()

}

function fig_to_field(){
    if (!cur) {
        console.error("Cur figure not generated!")
        return
    }
    for (var y = 0; y < 4; ++y) {
        for (var x = 0; x < 4; x++) {
            if (cur[y][x]) {
                fld[cur_y + y][cur_x + x] = cur[y][x]
            }
        }
    }
}

function update_level(){
    score+=clear_rows()
    if( score - pscore >= 2){
        pscore = score
        ++level
        clearInterval(interval)
        timeout=setTimeout(() =>
            interval = setInterval(() =>iterate(),level_to_interval(level))
            , level_to_interval(level-1));

        /*
        interval = setInterval(() =>
                iterate()
            , 1000 * Math.exp(-level/2));
        */
    }
    update_info()
}

function level_to_interval(lvl){
    //1000 * Math.exp(-level/2)
    return 1000*(1-lvl*.1)
}

function update_score() {
    let arr;
    if(localStorage.hasOwnProperty('higthscores')){
        arr = JSON.parse(localStorage.getItem('higthscores'));
        arr.push({name: player_name, score: score});
        arr.sort(function (a,b) {
            return b.score - a.score;
        });

        while(arr.length>10){
            arr.pop();
        }
        localStorage.setItem('higthscores',JSON.stringify(arr));
    }else{
        arr = [];
        arr.push({name:player_name,score: score});
        localStorage.setItem('higthscores',JSON.stringify(arr));
    }

    var table = '<table>';
    for( var i = 0; i < arr.length; i++ ){
        table += '<tr>';
        table += '<td>' + (Number(i)+1) +'</td>';
        table += '<td>' + arr[i].name +'</td>';
        table += '<td>' + arr[i].score +'</td>';
        table += '</tr>';
    }
    table += '</table>';
    document.getElementById('scoreboard').innerHTML = table;
    update_info()
}

function iterate(){
    if(!is_cur_fit(cur_x,cur_y+1)){
        fig_to_field()
        cycle_fig()
        update_level()

        spawn_or_loose()
    }else{
        ++cur_y
    }
    render()
}

function update_info(){
    document.getElementById("pname").innerHTML = "Игрок: " + player_name;
    document.getElementById("pscore").innerHTML = "Очки: " + score;
    document.getElementById("plevel").innerHTML = "Уровень: " + level;
}

function start_game() {
    level = 0
    cycle_fig()
    console.log("cycle:")
    console.log(cur)
    console.log(next)
    reset_fld()
    spawn_or_loose()
    console.log(cur_x, cur_y)
    render()

    interval = setInterval(() =>
            iterate()
        , level_to_interval(level));

    update_info()
    update_score()
}
start_game()



document.body.onkeydown = function (e) {
    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
            if(is_cur_fit(cur_x-1,cur_y))
                --cur_x
            break;
        case 'ArrowRight':
        case 'd':
            if(is_cur_fit(cur_x+1,cur_y))
                ++cur_x
            break;
        case 'ArrowDown':
        case 's':
            if(is_cur_fit(cur_x,cur_y+1))
                ++cur_y
            drop=true
            break;
        case 'ArrowUp':
        case 'w':
            var rotated = rotate_fig(cur);
            if(is_cur_fit(cur_x,cur_y,rotated)) cur = rotated;
            break;
    }
    render()
}

function go_home(){
    window.location = "../index.html";
}
/*
var cvs = document.getElementById("canvas")

/*const interval = setInterval(() =>
        console.log("periodic task")
    , 1000);
*/
/*
if (canvas.getContext) {
    let ctx = canvas.getContext('2d');
    ctx.fillRect(25,25,100,100);
    ctx.clearRect(45,45,60,60);
}
*/
/*
var cvs = document.getElementById("canvas");

var ctx = cvs.getContext("2d");

var myImg = new Image();
myImg.src = "img/Astern512"


function draw() {
    ctx.drawImage(myImg, 0, 0);



    requestAnimationFrame(draw); // Вызов функции постоянно
}

draw(); // Вызов функции из вне
*/