/**
 * Created by h205p3 on 2/7/17.
 */
$(document).ready(function(){
    //Canvas stuff
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    //var cw = cell width
    var cw = 10;
    var d;
    var food;
    var score;
    var snake_array;
var j=[{x:4,y:4},{x:5,y:4},{x:4,y:5},{x:4,y:6},{x:5,y:6},
        {x:7,y:4},{x:7,y:5},{x:7,y:6},{x:8,y:6},{x:9,y:6},{x:9,y:5},{x:9,y:4},
        {x:11,y:4},{x:12,y:4},{x:11,y:5},{x:11,y:6},{x:12,y:6},
        {x:14,y:4},{x:14,y:5},{x:14,y:6},{x:16,y:4},{x:15,y:5},{x:16,y:6}]// Multiplayer sync

    function init()
    {
        d = "right"; //default direction
        create_snake();
        create_food();
        score = 0;

        //move the snake using a timer to run the paint function every 60ms
        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 60);
    }
    init();

    function create_snake()
    {
        var length = 5; //Length of the snake
        snake_array = []; //Empty array to start with
        for(var i = length-1; i>=0; i--)
        {
            snake_array.push({x: i, y:0});
        }
    }

    function create_food()
    {
        food = {
            x: Math.round(Math.random()*(w-cw)/cw),
            y: Math.round(Math.random()*(h-cw)/cw)
        };
    }

    function paint()
    {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);

	// multiplayer
	ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);

        //How to move: Pop out the tail cell and place it in front of the head cell
        var nx = snake_array[0].x;
        var ny = snake_array[0].y;
        // ^ That's the position of the head cell.

        if(d == "right") nx++;
        else if(d == "left") nx--;
        else if(d == "up") ny--;
        else if(d == "down") ny++;
        // ^ This adds direction based movement

        //Game Over conditions are: Snake hits wall, snake head hits body
        if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
        {
            //restart game
            init();
            return;
        }

        if(nx == food.x && ny == food.y)
        {
            var tail = {x: nx, y: ny};
            score++;
            //Create new food
            create_food();
        }
        else
        {
            var tail = snake_array.pop(); //pops out the last cell
            tail.x = nx; tail.y = ny;
        }

        snake_array.unshift(tail); //puts back the tail as the first cell

        for(var i = 0; i < snake_array.length; i++)
        {
            var c = snake_array[i];
            paint_cell(c.x, c.y);
        }
for(var i=-1;++i<j.length;)
        {
            paint_cell(j[i].x,j[i].y); // Second player
        }

        paint_cell(food.x, food.y);
        var score_text = "Score: " + score;
        ctx.fillText(score_text, 5, h-5);
    }

    function paint_cell(x, y)
    {
        ctx.fillStyle = "black";
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }

    function check_collision(x, y, array)
    {
        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    }
    $(document).keydown(function(e){
        var key = e.which;
        if(key == "37" && d != "right") d = "left";
        else if(key == "38" && d != "down") d = "up";
        else if(key == "39" && d != "left") d = "right";
        else if(key == "40" && d != "up") d = "down";
    })
});
