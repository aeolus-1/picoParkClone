var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;
Composites = Matter.Composites;
Constraint = Matter.Constraint;

Matter.Common.nextId = function(){return crypto.randomUUID()}

class MatterHandler {
  constructor(game, options) {
    this.game = game
    this.engine = Engine.create({
      velocityIterations:15,
    });
    this.engine.gravity.scale *= 2

    this.running = false

    this.options = {
      ghost:{
        collisionFilter:{
          catagory:2,
          group:1,
          mask:0,
        },
        isStatic:true,
      }
    }
    
    

  }

  init() {
    Runner.run(this.engine)
    this.running = true
  }

  addBody(pos,size,options,comp=this.engine.world) {
    var rect = Bodies.rectangle(pos.x,pos.y,size.x,size.y,{
        inertia:Infinity,
        friction:0,
        //frictionStatic:1,
        //frictionAir:1
        //slop:1,
        //restitution:1.3,
        collisionFilter:{
            //group:1
        },
        ...options,
    })
    console.log(pos)
    Matter.Body.setPosition(rect, pos)
    Matter.Composite.add(comp, rect);

    return rect

}
}

//engine.world = (new Resurrect()).resurrect('[{"id":0,"type":"composite","parent":null,"isModified":true,"bodies":{"#":1},"constraints":{"#":27},"composites":{"#":33},"label":"World","plugin":{"#":34},"cache":{"#":35},"gravity":{"#":38}},[{"#":2}],{"id":2,"type":"body","label":"Body","parts":{"#":3},"plugin":{"#":4},"angle":0,"vertices":{"#":5},"position":{"#":9},"force":{"#":10},"torque":0,"positionImpulse":{"#":11},"constraintImpulse":{"#":12},"totalContacts":0,"speed":0,"angularSpeed":0,"velocity":{"#":13},"angularVelocity":0,"isSensor":false,"isStatic":true,"isSleeping":false,"motion":0,"sleepThreshold":60,"density":0.001,"restitution":0,"friction":0.1,"frictionStatic":0.5,"frictionAir":0.01,"collisionFilter":{"#":14},"slop":0.05,"timeScale":1,"render":{"#":17},"events":null,"bounds":{"#":19},"chamfer":null,"circleRadius":0,"positionPrev":{"#":22},"anglePrev":0,"parent":{"#":2},"axes":{"#":23},"area":23437.5,"mass":23.4375,"inertia":1555989.5833333333,"_original":null,"isActuallyStatic":true,"inverseInertia":6.426778242677825e-7,"inverseMass":0.042666666666666665,"sleepCounter":0},[{"#":2}],{},[{"#":6},{"#":7},{"#":8}],{"x":75,"y":325,"index":0,"body":{"#":2},"isInternal":false},{"x":700,"y":325,"index":1,"body":{"#":2},"isInternal":false},{"x":400,"y":400,"index":2,"body":{"#":2},"isInternal":false},{"x":391.6666666666667,"y":350},{"x":0,"y":0},{"x":0,"y":0},{"x":0,"y":0,"angle":0},{"x":0,"y":0},{"category":1,"mask":4294967295,"group":1,"collidesWith":{"#":15},"cannotCollideWith":{"#":16}},[],[],{"visible":true,"opacity":1,"strokeStyle":"#000","fillStyle":"#222","lineWidth":3,"sprite":{"#":18}},{"xScale":1,"yScale":1,"xOffset":0.5066666666666667,"yOffset":0.3333333333333333},{"min":{"#":20},"max":{"#":21}},{"x":75,"y":325},{"x":700,"y":400},{"x":391.6666666666667,"y":350},[{"#":24},{"#":25},{"#":26}],{"x":0,"y":-1},{"x":0.24253562503633297,"y":0.9701425001453319},{"x":-0.22485950669875843,"y":0.9743911956946198},[{"#":28}],{"label":"Mouse Constraint","pointA":{"#":29},"pointB":{"#":30},"length":0.01,"stiffness":0,"angularStiffness":1,"render":{"#":31},"id":1,"type":"constraint","damping":0,"angleA":{"#":-1},"angleB":{"#":-1},"plugin":{"#":32}},{"x":2442.5,"y":1212.5},{"x":0,"y":0},{"visible":true,"lineWidth":3,"strokeStyle":"#90EE90","type":"spring","anchors":true},{},[],{},{"allBodies":{"#":36},"allConstraints":{"#":37},"allComposites":null},[{"#":2}],[{"#":28}],{"x":0,"y":1,"scale":0.002}]')







/*

var mouse = Matter.Mouse.create(render.canvas);
var mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 1,
    render: { visible: true },
  },
});

Matter.Composite.add(engine.world, mouseConstraint);
*/






