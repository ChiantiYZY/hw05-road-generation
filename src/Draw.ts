import {vec3} from 'gl-matrix';
import Turtle from './Turtle';
import Terrain from './Terrain';
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh';
//import { scale } from 'gl-matrix/src/gl-matrix/vec2';

export default class Draw {

    turtles: Array<Turtle> = [new Turtle()];
    cur = this.turtles[0];

    rules : Map<string, any> = new Map();
    sca : number;
    ang : number;
    map = new Terrain();

    //scale = Math.random();

    constructor()
    {
        // let obj0: string = readTextFile('../branch.obj');
        // let m = new Mesh(obj0, vec3.fromValues(0, 0, 0));
        // m.create();
        this.sca = 1.0;
        this.ang = 1.0;

    }

    pushTurtle()
    {
        let tmp = new Turtle();
        tmp.copy(this.cur);
       // vec3.copy(tmp.prevPos, this.cur.position);
        this.turtles.push(tmp);

    }

    popTurtle()
    {
        let tmp = this.turtles.pop();
        this.cur.copy(tmp);
        
    }

    growUp()
    {
        this.cur.growUp(this.sca);
    }

    rotateRight()
    {
        let flag = Math.random();
        let angle = this.ang * Math.random();


        //this.cur.rotateOnZ(1.57 * angle);
        
        if(flag < 0.33)
            this.cur.rotateOnZ(angle);
        else if(flag < 0.67)  
            this.cur.rotateOnY(angle);
        else
            this.cur.rotateOnX(angle);
        // else    
        //     this.cur.growUp(1);
    }

    rotateLeft()
    {
        let flag = Math.random();
        let angle = this.ang * -Math.random();
        
        if(flag < 0.33)
            this.cur.rotateOnZ(angle);
        else if(flag < 0.67)  
            this.cur.rotateOnY(angle);
        else
            this.cur.rotateOnX(angle);
    }

    rotateForward()
    {
        let flag = Math.random();
        this.cur.rotateOnY(1.57 * flag);
        //console.log('check rotate: ');
       // console.log(this.cur);
    }

    rotateBack()
    {
        let flag = Math.random();
        this.cur.rotateOnY(-1.57 * flag);
        //console.log('check rotate: ');
       // console.log(this.cur);
    }

    seek()
    {

        // console.log('check seek');
        var cur_map = this.turtles.map;
        var step = 1.0;
        var angle = 3.14 / 8.0;

        var highDense = 0;

        var flag = false; 

        let new_turtle = new Turtle();

        var i = Math.random() * 100 % 8;

        // this.cur.rotateOnZ(angle * i);
        // this.cur.growUp(0.3);


        // for(var i = 0; i < 8; i++)
        // {
        //     let tmp = new Turtle();
        //     tmp.copy(this.cur);
        //     tmp.rotateOnZ(angle * i);
        //     tmp.growUp(0.3);
        //     var position = tmp.position;

        //     //.log('tmp pos: ');

        //     var density = this.map.getDensity(position);

        //     //console.log('density is: ' + density);
        //     if(highDense < density)
        //     {
        //         flag = true;
        //         highDense = density;
        //         new_turtle.copy(tmp);
  
        //     }
            
        // }

        // if(flag == true)
        // {
        //     this.turtles.push(new_turtle);
        //     this.cur.copy(new_turtle);
        //     // console.log('cur density: ' + this.map.getDensity(this.cur.position));
        //     // console.log('cur position:' + (this.cur.position)) ;
        // }
        // else
        // {
        //     this.popTurtle();
        // }

        

        this.cur.rotateOnZ(3.14 / 2.0);
        
        this.cur.growUp(0.3);




        // let tmp = new Turtle();
        // tmp.rotateOnZ(0.25);
        // tmp.growUp(0.1);



        //this.growUp();
        // console.log('cur turtle is: ');
        // console.log(this.cur);
    }

    setRule()
    {
        this.rules.set('F', this.growUp.bind(this));
        this.rules.set('*', this.growUp.bind(this));
        this.rules.set('+', this.rotateRight.bind(this));
        this.rules.set('-', this.rotateLeft.bind(this));
        this.rules.set('>', this.rotateForward.bind(this));
        this.rules.set('<', this.rotateBack.bind(this));
        //this.rules.set('-', this.cur.rotateOnZ.bind(this.cur));
        
        this.rules.set('[', this.pushTurtle.bind(this));
        this.rules.set(']', this.popTurtle.bind(this));

        //this.rules.set('B', this.seek.bind(this));
        this.rules.set('B', this.seek.bind(this));
        
        
    }

    draw(grammar: string)
    {
        let func = this.rules.get(grammar);

        if(func)
        {
            func();
        }
    }

};