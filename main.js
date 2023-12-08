import { Bodies, Body, Collision, Engine, Events, Render, Runner, World } from "matter-js";
import { TEARS } from "./fruits";


const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  }
});

const world = engine.world;

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

const gameLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "gameLine",
  isStatic: true,
  isSensor: true,
  render: {fillStyle: "#E6B143"}
});

World.add(world,[leftWall, rightWall,ground,gameLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentTear = null;
let disableAction = false;
let interval = null;
let num = 0;

function addTear(){
  const index = Math.floor(Math.random() * 5);
  const tear = TEARS[index];

  const body = Bodies.circle(300, 50, tear.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: {texture: `${tear.name}.png` }
    },
    restitution: 0.2,
  });

  currentBody = body;
  currentTear = tear;

  World.add(world,body);
}

window.onkeydown = (event) => {
  if (disableAction) {
    return;
  }

  switch (event.code) {
    case "KeyA":
      if (interval)
        return;

      interval = setInterval(() => {
        if (currentBody.position.x - currentTear.radius > 30)
          Body.setPosition(currentBody, {
            x: currentBody.position.x - 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case "KeyD":
      if (interval)
        return;

      interval = setInterval(() => {
        if (currentBody.position.x + currentTear.radius < 590)
        Body.setPosition(currentBody, {
          x: currentBody.position.x + 1,
          y: currentBody.position.y,
        });
      }, 5);
      break;

    case "KeyS":
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addTear();
        disableAction = false;
      }, 1000);
      break;
  }
}


window.onkeyup = (event) => {
  switch (event.code){
    case "KeyA":
    case "KeyD":
      clearInterval(interval);
      interval = null;
  }
}

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;


      if (index === TEARS.length - 1) {
        return;
      }

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newTear = TEARS[index + 1];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newTear.radius,
        {
          render: {
            sprite: { texture: `${newTear.name}.png` }
          },
          index: index + 1,
        }
      );

      World.add(world, newBody);
      if(newBody.index===TEARS.length -1){
        num++;
      }
      if(num === 2){
        alert("또 너야 대상혁?")
      }
    }

    if (
      !disableAction &&
      (collision.bodyA.name === "gameLine" || collision.bodyB.name === "gameLine")) {
      alert("Game over");
    
    }
  });
});
addTear();