const Engine = Matter.Engine,
    Events = Matter.Events,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Detector = Matter.Detector,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;

let sizeX = 2000,
    sizeY = 2000
//releaseT = 50

let engine = Engine.create(),
    world = engine.world;

world.gravity.scale = 0.00//3;

let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 900,
        height: 900,
        wireframes: false,
        background: '#404040'
    }
});

Render.run(render);

let runner = Runner.create();
Runner.run(runner, engine);

let group = Body.nextGroup(true),
    goalWidth = 500,
    goalLength = 50,
    borderWidth = 50,
    ballRadius = 25;

let leftBorder = Bodies.rectangle(borderWidth / 2, sizeY / 2, borderWidth, sizeX, {
    frictionAir: 0,
    chamfer: 0,
    render: {
        strokeStyle: '#ffffff',
        fillStyle: 'transparent',
        lineWidth: 3
    }
})

let topBorder = Bodies.rectangle(sizeX / 2, borderWidth / 2, sizeX, borderWidth, {
    frictionAir: 0,
    chamfer: 0,
    render: {
        strokeStyle: '#ffffff',
        fillStyle: 'transparent',
        lineWidth: 3
    }
})

let rightBorder = Bodies.rectangle(sizeX - borderWidth / 2, sizeY / 2, borderWidth, sizeY, {
    frictionAir: 0,
    chamfer: 0,
    render: {
        strokeStyle: '#ffffff',
        fillStyle: 'transparent',
        lineWidth: 3
    }
})

let botBorder = Bodies.rectangle(sizeX / 2, sizeY - borderWidth / 2, sizeX, borderWidth, {
    frictionAir: 0,
    chamfer: 0,
    render: {
        strokeStyle: '#ffffff',
        fillStyle: 'transparent',
        lineWidth: 3
    }
})

let leftGoal = Bodies.rectangle(borderWidth + goalLength / 2, sizeY / 2, goalLength, goalWidth, {
    isSensor: true,
    frictionAir: 0,
    chamfer: 0,
    render: {
        strokeStyle: '#ffffff',
        fillStyle: 'transparent',
        lineWidth: 3
    }
})

let topGoal = Bodies.rectangle(sizeX / 2, borderWidth + goalLength / 2, goalWidth, goalLength, {
    isSensor: true,
    frictionAir: 0,
    chamfer: 0,
    render: {
        strokeStyle: '#ffffff',
        fillStyle: 'transparent',
        lineWidth: 3
    }
})

let rightGoal = Bodies.rectangle(sizeX - goalLength / 2 - borderWidth, sizeY / 2, goalLength, goalWidth, {
    isSensor: true,
    frictionAir: 0,
    chamfer: 0,
    render: {
        strokeStyle: '#ffffff',
        fillStyle: 'transparent',
        lineWidth: 3
    }
})

let botGoal = Bodies.rectangle(sizeX / 2, sizeY - goalLength / 2 - borderWidth, goalWidth, goalLength, {
    isSensor: true,
    frictionAir: 0,
    chamfer: 0,
    render: {
        strokeStyle: '#ffffff',
        fillStyle: 'transparent',
        lineWidth: 3
    }
})

Body.setStatic(leftGoal, true);
Body.setStatic(topGoal, true);
Body.setStatic(rightGoal, true);
Body.setStatic(botGoal, true);
Body.setStatic(leftBorder, true);
Body.setStatic(topBorder, true);
Body.setStatic(rightBorder, true);
Body.setStatic(botBorder, true);

let ball = Bodies.circle(sizeX / 2, sizeY / 2, ballRadius, {
    collisionFilter: { group: group },
    frictionAir: 0.05,
    render: {
        fillStyle: '#ffffff',
        lineWidth: 1
    }
})

let actor = Bodies.polygon(sizeX / 2 + ballRadius * 8, sizeY / 2, 8, ballRadius / 2, {
    frictionAir: 0,
    chamfer: 0,
    inertia: Infinity,
    render: {
        strokeStyle: '#ffffff',
        fillStyle: '#ffffff',
        lineWidth: 1
    }
})

World.add(world, [leftGoal, botGoal, rightGoal, topGoal, leftBorder, botBorder, rightBorder, topBorder, ball, actor])

let goals = [leftGoal, topGoal, rightGoal, botGoal];
let sensorObjects = goals.concat(ball);

var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene

Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: sizeX, y: sizeY }
});




let selectedGoal,
    numSensors = 128,
    rayColors = ['#ffffff', '#ffff00', '#03fc07', '#ff0000'],
    speed = 3,
    positiveClr = "#10cc10",
    negativeClr = "#dd1010"

function assessSurroudings() {
    let ballPoint = actor.position;
    let tRad = Math.PI / numSensors * 2;
    let sensorValues = [];
    for (let i = 0; i < numSensors; i++) {
        let sensorValue;
        let finalPoint = { x: ballPoint.x + sizeX * Math.sqrt(2) * Math.cos(tRad * i), y: ballPoint.y + sizeY * Math.sqrt(2) * Math.sin(tRad * i) }
        let collisions = Matter.Query.ray(sensorObjects, ballPoint, finalPoint, 1);
        let len = collisions.length;
        for (let j = 0; j < len; j++) {
            switch (collisions[j].body) {
                case ball:
                    sensorValue = 1;
                    break;
                case goals[selectedGoal]:
                    !sensorValue || sensorValue > 2 ? sensorValue = 2 : null;
                    break;
                default:
                    !sensorValue ? sensorValue = 3 : null;
            }
        }
        !sensorValue ? sensorValue = 0 : null;
        createRay(ballPoint, finalPoint, sensorValue);
        sensorValues.push(sensorValue);
    }
    dqn_learn(sensorValues)
}

function selectGoal() {
    selectedGoal = parseInt(Math.random() * 4)
}

selectGoal();
function createRay(initial, final, clr) {
    Render.startViewTransform(render);
    let { context } = render;
    context.globalAlpha = 0.9;
    context.strokeStyle = rayColors[clr];
    context.beginPath();
    context.setLineDash([15, 25]);
    context.moveTo(initial.x, initial.y);
    context.lineTo(final.x, final.y);
    context.stroke();
    context.setLineDash([]);
    context.globalAlpha = 1;
    Render.endViewTransform(render);
}
Events.on(render, 'afterRender', function () {
    assessSurroudings();
})


function moveActor(dir) {
    let tBodyPos = goals[selectedGoal].position;
    switch (dir) {
        case 0:
            Body.setVelocity(actor, { x: 0, y: speed })
            break;
        case 1:
            Body.setVelocity(actor, { x: speed / Math.sqrt(2), y: speed / Math.sqrt(2) })
            break;
        case 2:
            Body.setVelocity(actor, { x: speed, y: 0 })
            break;
        case 3:
            Body.setVelocity(actor, { x: speed / Math.sqrt(2), y: -speed / Math.sqrt(2) })
            break;
        case 4:
            Body.setVelocity(actor, { x: 0, y: -speed })
            break;
        case 5:
            Body.setVelocity(actor, { x: -speed / Math.sqrt(2), y: -speed / Math.sqrt(2) })
            break;
        case 6:
            Body.setVelocity(actor, { x: -speed, y: 0 })
            break;
        case 7:
            Body.setVelocity(actor, { x: -speed / Math.sqrt(2), y: speed / Math.sqrt(2) })
            break;
        default:
            null;
    }
    return assignReward()
}

function distCheck(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2)
}

let posCollisions = goals.map(x => [x, ball]);

function assignReward() {
    let rtVal = 0,
        actorBall = distCheck(actor.position.x + actor.velocity.x, actor.position.y + actor.velocity.y, ball.position.x, ball.position.y) + speed - distCheck(actor.position.x, actor.position.y, ball.position.x, ball.position.y),
        ballGoal = distCheck(ball.position.x + ball.velocity.x, ball.position.y + ball.velocity.y, goals[selectedGoal].position.x, goals[selectedGoal].position.y) + speed - distCheck(ball.position.x, ball.position.y, goals[selectedGoal].position.x, goals[selectedGoal].position.y),
        ballOtherMinDist,
        ballGoalDist = distCheck(ball.position.x, ball.position.y, goals[selectedGoal].position.x, goals[selectedGoal].position.y),
        vectorDiff = Math.acos(((ball.position.x - actor.position.x) * (goals[selectedGoal].position.x - ball.position.x) + (ball.position.y - actor.position.y) * (goals[selectedGoal].position.y - ball.position.y)) / (Math.hypot(ball.position.x - actor.position.x, ball.position.y - actor.position.y) * Math.hypot(goals[selectedGoal].position.x - ball.position.x, goals[selectedGoal].position.y - ball.position.y)))
    //console.log(0.5 * (1 - (actorBall) / speed), 0.5 * (1 - (ballGoal) / speed))

    for (let i = 0; i < goals.length; i++) {
        if (i !== selectedGoal) {
            let tDist = distCheck(ball.position.x, ball.position.y, goals[i].position.x, goals[i].position.y)
            if (ballOtherMinDist == null || ballOtherMinDist > tDist) {
                ballOtherMinDist = tDist;
            }
        }
    }

    rtVal += 0.25 * (1 - (actorBall) / speed)
    rtVal += 0.25 * (1 - (ballGoal) / speed)
    rtVal += 0.25 * (1 - ballGoalDist / ballOtherMinDist);
    rtVal += 0.25 * (1 - vectorDiff / Math.PI * 2);

    if (rtVal > 0) {
        ball.render.fillStyle = lightenColor(positiveClr, rtVal)
    } else {
        ball.render.fillStyle = lightenColor(negativeClr, Math.abs(rtVal))
    }

    //rtVal += 0.25 * (1 - (actorBall) / speed)
    let coll = Detector.collisions(posCollisions, engine);
    // let len = coll.length;
    // for (let i = 0; i < len; i++) {
    //     let tempComp = coll[i];
    //     if (tempComp.includes(ball) && tempComp.includes(actor)) {

    //     } else if (tempComp.includes(ball) && tempComp.includes(goals[selectedGoal])) {

    //     } else {
    if (coll.length !== 0) { selectGoal(); Body.setPosition(ball, { x: sizeX / 2, y: sizeY / 2 }); }
    //         ball.position = { x: sizeX / 2, y: sizeY / 2 };
    //         return 1;
    //     }
    // }
    return rtVal;
}



function lightenColor(clr, factor) {
    let temp = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clr);
    let rClr = parseInt(temp[1], 16)
    let gClr = parseInt(temp[2], 16)
    let bClr = parseInt(temp[3], 16)
    function partHexDark(part) {
        let hex = (Math.round(part / factor)).toString(16);
        return hex.length == 1 ? "0" + hex : hex.length > 2 ? "ff" : hex;
    }
    function makeHex(r, g, b) {
        return "#" + partHexDark(r) + partHexDark(g) + partHexDark(b);
    }
    return makeHex(rClr, gClr, bClr);
}


































/*
 
let trail = [];
 
Events.on(render, 'afterRender', function () {
    trail.unshift(Vector.clone(ball.position));
 
    Render.startViewTransform(render);
    let { context } = render;
    context.globalAlpha = 0.7;
 
    for (var i = 0; i < trail.length; i += 1) {
        var point = trail[i];
        context.fillStyle = '#cffffc';
        context.fillRect(point.x, point.y, 2, 2);
    }
 
    if (trail.length > 2000) {
        trail.pop();
    }
 
    context.strokeStyle = '#ff0000'
    context.beginPath();
    context.setLineDash([20, 20]);
    context.moveTo(target.x, target.y);
    context.lineTo(ball.position.x, ball.position.y);
    context.stroke();
    context.setLineDash([]);
 
    context.fillStyle = '#33ff00'
    context.beginPath();
    context.arc(target.x, target.y, 10, 0, 2 * Math.PI);
    context.fill();
 
    render.context.globalAlpha = 1;
    Render.endViewTransform(render);
 
});
 
*/
// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene

Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: sizeX, y: sizeY }
});

// function getTopAng() { return reduceAngle(topArm.angle) }
// function getBotAng() { return reduceAngle(botArm.angle) }
// function getTopAngVel() { return topArm.angularVelocity }
// function getBotAngVel() { return botArm.angularVelocity }
// function getBallX() { return ball.position.x }
// function getBallY() { return ball.position.y }
// function getTargetX() { return target.x }
// function getTargetY() { return target.y }
// function setTopAngVel(choice) {
//     let tVel = topArm.angularVelocity;
//     switch (choice) {
//         case 2: tVel = 0; break;
//         case 1: tVel > 0 ? tVel += changeSpeed : tVel = changeSpeed; break;
//         case 0: tVel < 0 ? tVel -= changeSpeed : tVel = -changeSpeed;
//     }
//     Body.setAngularVelocity(topArm, tVel)
// }
// function setBotAngVel(choice) {
//     let tVel = botArm.angularVelocity;
//     switch (choice) {
//         case 2: tVel = 0; break;
//         case 1: tVel > 0 ? tVel += changeSpeed : tVel = changeSpeed; break;
//         case 0: tVel < 0 ? tVel -= changeSpeed : tVel = -changeSpeed;
//     }
//     Body.setAngularVelocity(botArm, tVel)
// }

// function reduceAngle(ang) {
//     let rt = Math.atan(Math.tan(ang)),
//         m360 = ang % (2 * Math.PI),
//         m180 = ang % (Math.PI);
//     if ((m360 < Math.PI && m180 > Math.PI / 2) || (m360 < -Math.PI && m180 > -Math.PI / 2)) {
//         rt += Math.PI;
//     } else if ((m360 > Math.PI && m180 < Math.PI / 2) || (m360 > -Math.PI && m180 < -Math.PI / 2)) {
//         rt -= Math.PI;
//     }
//     return rt;
// }

// function createTarget() {
//     let tempX, tempY
//     do {
//         tempX = sizeX * Math.random();
//         tempY = sizeY * Math.random();
//     } while (Math.hypot(tempX - sizeX / 2, tempY - sizeY / 2) > sizeY / 2)
//     target = { x: tempX, y: tempY }
// }
// createTarget();
//setInterval(createTarget, 20000)
/*
function targetCheck() {
    let tDist = distCheck(ball.position.x, ball.position.y, target.x, target.y);
    let sampleDist = distCheck(sizeX / 2, sizeY / 2, target.x, target.y)
    if (tDist < ballRadius) {
        createTarget();
    }
    return 1 - tDist / sampleDist;
}
 
function botLearn() {
    let tDist = distCheck(ball.position.x, ball.position.y, target.x, target.y);
    let sampleDist = distCheck(target.x, target.y, sizeY / 2 + 2 * padFactor * armLength * Math.cos(topArm.angle), sizeY / 2 + 2 * padFactor * armLength * Math.sin(topArm.angle))
    console.log(`this: ${sampleDist}`)
    return 1 - tDist / sampleDist;
}
*/
let rewardTop = 0, rewardBot = 0
function targetCheck() {
    let tDist = distCheck(ball.position.x, ball.position.y, target.x, target.y);
    let sampleDist = distCheck(sizeX / 2, sizeY / 2, target.x, target.y)
    if (tDist < ballRadius) {
        createTarget();
        return 1
    }
    //let tReward = rewardTop;
    return 1 - tDist / sampleDist;
    //return rewardTop > tReward ? 0.5 : 0;
}

function botLearn() {
    let tDist = distCheck(ball.position.x, ball.position.y, target.x, target.y);
    let sampleDist = distCheck(target.x, target.y, sizeY / 2 + 2 * padFactor * armLength * Math.cos(topArm.angle), sizeY / 2 + 2 * padFactor * armLength * Math.sin(topArm.angle))
    //let tReward = rewardBot;
    return 1 - tDist / sampleDist;
    //return rewardBot > tReward ? 0.5 : 0;
}


/*
setTimeout(() => {
    world.gravity.scale = 0.001
    Body.setAngularVelocity(totSystem.bodies[0], angVelTop);
    Body.setAngularVelocity(totSystem.bodies[1], angVelBot);
    setTimeout(() => { Composite.remove(totSystem, totSystem.constraints[2]) }, releaseT)
}, 1000)
*/