/*

Zodra je de game opent, krijg je een console log
1 = [1][2][3]

 */

PIXI.loader
    .add("required/assets/buttonPlay.png", "required/assets/buttonPlay.png")
    .add("required/assets/eggHead.png", "required/assets/eggHead.png")
    .add("required/assets/flowerTop.png", "required/assets/flowerTop.png")
    .add("required/assets/helmlok.png", "required/assets/helmlok.png")
    .add("required/assets/skully.png", "required/assets/skully.png")
    .load(onAssetsLoaded);
// de lengte tussen de slots
// De size van de slots
var REEL_WIDTH = 240;
var SYMBOL_SIZE = 170;


// Maakt verschillende slots aan
function onAssetsLoaded() {
    var slotTextures = [
        PIXI.Texture.fromImage("required/assets/eggHead.png"),
        PIXI.Texture.fromImage("required/assets/flowerTop.png"),
        PIXI.Texture.fromImage("required/assets/helmlok.png"),
        PIXI.Texture.fromImage("required/assets/skully.png")
    ];

    // Build the reels
    var reels = [];
    var reelContainer = new PIXI.Container();
    // Hoeveel Reels vakken er moeten zijn
    for (var i = 0; i < 5; i++) {
        var rc = new PIXI.Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);

        var reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.filters.BlurFilter()
        };
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];
        var nieuweSprites = Object.values(reel);

        // Hoeveel textures die moet bouwen en spinnen, Scale the symbol to fit symbol area.
        for (var j = 0; j < 4; j++) {
            var symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol);
            rc.addChild(symbol);
        }
        reels.push(reel);
        console.log(nieuweSprites[1]);
    }
    app.stage.addChild(reelContainer);

    //Build top & bottom covers and position reelContainer
    var margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
    reelContainer.y = margin;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
    var top = new PIXI.Graphics();
    top.beginFill(0, 1);
    top.drawRect(0, 0, app.screen.width, margin);
    var bottom = new PIXI.Graphics();
    bottom.beginFill(0, 1);
    bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);

    app.stage.addChild(bottom);
    app.stage.addChild(top);

    // Buttons
    // 3 Lines Button
    var ThreeLinesButton = new PIXI.Sprite.fromImage("required/assets/3lines.png");
    ThreeLinesButton.interactive = true;
    ThreeLinesButton.buttonMode = true;
    ThreeLinesButton.x = Math.round((bottom.width - ThreeLinesButton.width) / 2 + 210);
    ThreeLinesButton.y = app.screen.height - margin + Math.round((margin - ThreeLinesButton.height) / 4);
    app.stage.addChild(ThreeLinesButton);
    ThreeLinesButton.addListener("pointerdown", function () {
        threeLines();
    });

    // Play Button
    var buttonPlay = new PIXI.Sprite.fromImage("required/assets/buttonPlay.png");
    buttonPlay.interactive = true;
    buttonPlay.buttonMode = true;
    buttonPlay.x = Math.round((bottom.width - buttonPlay.width) / 2);
    buttonPlay.y = app.screen.height - margin + Math.round((margin - buttonPlay.height) / 2);
    app.stage.addChild(buttonPlay);
    buttonPlay.addListener("pointerdown", function () {
        startPlay();
    });


    var running = false;

    //Function to start playing.
    function startPlay() {
        if (running) return;
        running = true;
        console.log("--");
        for (var i = 0; i < reels.length; i++) {
            var r = reels[i];
            var extra = Math.floor(Math.random() * 3);
            tweenTo(r, "position", r.position + 10 + i * 5 + extra, 2000 + i * 600 + extra * 600, backout(0.5), null, i == reels.length - 1 ? reelsComplete : null);
            // console.log(reel);
            var nieuweSprites = Object.values(reel);
            console.log(nieuweSprites[1]);
        }

        // console.log(tweening);

    }


    //Reels done handler.
    function reelsComplete() {
        running = false;
        console.log("Reels Completed");
    }

// Listen for animate update.
    app.ticker.add(function (delta) {
        //Update the slots.
        for (var i = 0; i < reels.length; i++) {
            var r = reels[i];
            //Update blur filter y amount based on speed.
            //This would be better if calculated with time in mind also. Now blur depends on frame rate.
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            //Update symbol positions on reel.
            for (var j = 0; j < r.symbols.length; j++) {
                var s = r.symbols[j];
                var prevy = s.y;
                s.y = (r.position + j) % r.symbols.length * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    //Detect going over and swap a texture.
                    //This should in proper product be determined from some logical reel.
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                }
            }
        }
    });

    function threeLines() {
        console.log("3Lines Activated")
    }
}

//Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
var tweening = [];

function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    var tween = {
        object: object,
        property: property,
        propertyBeginValue: object[property],
        target: target,
        easing: easing,
        time: time,
        change: onchange,
        complete: oncomplete,
        start: Date.now()
    };

    tweening.push(tween);
    return tween;
}

// Listen for animate update.
app.ticker.add(function (delta) {
    var now = Date.now();
    var remove = [];
    for (var i = 0; i < tweening.length; i++) {
        var t = tweening[i];
        var phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase == 1) {
            t.object[t.property] = t.target;
            if (t.complete)
                t.complete(t);
            remove.push(t);
        }
    }
    for (var i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});

//Basic lerp funtion.
function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

//Backout function from tweenjs.
//https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
backout = function (amount) {
    return function (t) {
        return (--t * t * ((amount + 1) * t + amount) + 1);
    };
};

