import {vec2, vec3, mat4} from 'gl-matrix';
import Turtle from './Turtle'; 
import Expansion from './Expansion';
import Draw from './Draw';
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh';
import { isMaster } from 'cluster';
import Square from './geometry/Square';




export default class Lsytem {


    grammar: String;
    // grammars: Array<String> = ['X'];
    grammars: Array<String> = ['A'];
    iteration: number;
    expanse = new Expansion();
    drawing = new Draw();
    num: number;
    nums: Array<number> = [];
    c1: vec3 = vec3.create();
    c2: vec3 = vec3.create();
    curM: Mesh;
    curSQ: Square;
    isMesh: boolean

    constructor(it: number)
    {
        this.iteration = it;
        this.expanse.setRules();
        this.drawing.setRule();
        this.num = 1.0;
        this.isMesh = false;
        this.grammar = 'X';
    }

    test() {
        console.log("check \n")
    }

    expansion()
    {
        //console.log('grammar array size: ' + this.grammars.length);
        //if haven't iterated so much

        
        if(this.iteration >= this.grammars.length)
        {

            //console.log('check cur iteration: ' + this.iteration);
            //find the last expanded grammar 
            var lastIndex = this.grammars.length - 1;

            //calculate how much more iterations are needed 
            var moreIteration = this.iteration - this.grammars.length;

            for(var i = lastIndex; i < this.iteration; i++)
            {
                let last = this.grammars[lastIndex];
                // console.log('lst is:' + last); 
                let newStr = '';
                for(var j = 0; j < last.length; j++)
                {
                    newStr += this.expanse.expanse(last[j]);
                }

                //console.log('newStr is: ' + newStr);
                //push the new string to the grammar list 
                this.grammars.push(newStr);
                //update the last index
                lastIndex++;
            }

            return this.grammars[lastIndex];
        }
        else
        {
            return this.grammars[this.iteration];
        }
        
        return this.grammar;

    }

    draw(m : Mesh, p:Mesh, angle:number)
    {

        let count = 0;
        let count1 = 0;

        var grammar = this.expansion();
        this.drawing.ang = angle;


        console.log('grammar: ' + grammar);

        
        //console.log('grammar is: ' + grammar + '\n');
        for(var i = 0; i < grammar.length; i++)
        {
            this.isMesh = false;
            //move the turtle
            //console.log('num: ' + this.num);
            
            this.drawing.draw(grammar[i]);
            
            //num++;
            if(grammar[i] == 'F')
            {
                this.num ++;
            }
            if(grammar[i] == '[')
            {
                
                this.nums.push(this.num);
            }
            if(grammar[i] == ']')
            {
                this.num = this.nums.pop();
            }

            //this.drawing.sca = 5.0 / this.num;

            let freq = Math.random();

            let pos = this.drawing.cur.position;
            let rot = this.drawing.cur.orientation;
            //let sca = this.drawing.cur.scale;

            //console.log(this.drawing.cur);

            let radii = 1.0;
            
            if(grammar[i] == 'F' || grammar[i] == '-' || grammar[i] == '+')
            {   
                count ++;
                radii = 2.0;
                this.isMesh = true;
                this.curM = m;
                m.colorsArray.push(this.c1[0]);
                m.colorsArray.push(this.c1[1]);
                m.colorsArray.push(this.c1[2]);
                m.colorsArray.push(1.0); 
            }

            if(grammar[i] == '*')
            {
                if(this.num < 10)
                {
                    continue;
                }

                count1 ++;
                this.isMesh = true;
                this.curM = p;
                p.colorsArray.push(this.c2[0]);
                this.curM.colorsArray.push(this.c2[1]);
                this.curM.colorsArray.push(this.c2[2]); 
                this.curM.colorsArray.push(1.0);   
            }

            let transform = mat4.create();
            let rotate = mat4.create();
            let translate = mat4.create();
            let scalar = vec3.fromValues(radii * this.drawing.sca, this.drawing.sca, radii * this.drawing.sca);
            let scalation = mat4.create();
            mat4.fromQuat(rotate, rot);
            mat4.fromTranslation(translate, pos);
            mat4.fromScaling(scalation, scalar);
            mat4.multiply(rotate, rotate, scalation);
            mat4.multiply(transform, translate, rotate);

            //if the grammar is F, meaning that we need to show it on the screen
            if(this.isMesh)
            //if(grammar[i] == 'F' || grammar[i] == '-' || grammar[i] == '+')
            {

                this.curM.transArray1.push(transform[0] );
                this.curM.transArray1.push(transform[1]);
                this.curM.transArray1.push(transform[2]);
                this.curM.transArray1.push(transform[3] );

                this.curM.transArray2.push(transform[4]);
                this.curM.transArray2.push(transform[5] );
                this.curM.transArray2.push(transform[6]);
                this.curM.transArray2.push(transform[7] );
                
                this.curM.transArray3.push(transform[8]);
                this.curM.transArray3.push(transform[9]);
                this.curM.transArray3.push(transform[10]);
                this.curM.transArray3.push(transform[11]);

                this.curM.transArray4.push(transform[12]);
                this.curM.transArray4.push(transform[13]);
                this.curM.transArray4.push(transform[14]);
                this.curM.transArray4.push(transform[15]);

                let color = this.c1;
  
            }
        }

        //let offsets: Float32Array = new Float32Array(offsetsArray);
        let array1: Float32Array = new Float32Array(m.transArray1);
        let array2: Float32Array = new Float32Array(m.transArray2);
        let array3: Float32Array = new Float32Array(m.transArray3);
        let array4: Float32Array = new Float32Array(m.transArray4);
        let colors: Float32Array = new Float32Array(m.colorsArray);


        let parray1: Float32Array = new Float32Array(p.transArray1);
        let parray2: Float32Array = new Float32Array(p.transArray2);
        let parray3: Float32Array = new Float32Array(p.transArray3);
        let parray4: Float32Array = new Float32Array(p.transArray4);
        let pcolors: Float32Array = new Float32Array(p.colorsArray);
        //let rotates: Float32Array = new Float32Array(rotationArray);

        m.setInstanceVBOs(array1, array2, array3, array4, colors);
        m.setNumInstances(count); // grid of "particles"
        //console.log(this.drawing.turtles);

        //m.create();


        p.setInstanceVBOs(parray1, parray2, parray3, parray4, pcolors);
        p.setNumInstances(count1);

        //p.create();
    }


    drawRoad(sq : Square)
    {

        let count = 0;

        var grammar = this.expansion();


        //var grammar = 'BA';

        console.log(grammar);

        var prePos = vec2.fromValues(0, 0);

        
        //console.log('grammar is: ' + grammar + '\n');
        for(var i = 0; i < grammar.length; i++)
        {
            
            this.drawing.draw(grammar[i]);
            

            //this.drawing.sca = 5.0 / this.num;


            let pos = this.drawing.cur.position;
            let rot = this.drawing.cur.orientation;
            let pre = this.drawing.cur.prevPos;

            let pos_2 = vec2.fromValues(this.drawing.cur.position[0], this.drawing.cur.position[1]);
            var a = pos[0] - pre[0];
            var b = pos[1] - pre[1];
            var length = Math.sqrt(a * a + b * b);


            var test = vec3.fromValues(0, 0, 0);
            vec3.subtract(test, pos, pre);
            test = vec3.fromValues(test[0] / 2.0, test[1] / 2.0, 0);
            

            let radii = 1.0;
            
            if(grammar[i] == 'A' )
            {   
                count ++;
                radii = 2.0;
                this.isMesh = true;
                this.curSQ = sq;
            }


            let translatePos = vec3.fromValues(0, 0, 0);
            vec3.subtract(translatePos, pos, pre);


            let transPivot = vec3.fromValues( length, 0, 0);
            let movePivot = mat4.create();
            mat4.fromTranslation(movePivot, transPivot);

        
            //translatePos = vec3.fromValues(test[0], test[1], 0);    
            let transform = mat4.create();
            let rotate = mat4.create();
            let translate = mat4.create();
            //let scalar = vec3.fromValues(0.01, length * 2, 0);

            let scalar = vec3.fromValues(0.01, length * 2, 0);

            let scalation = mat4.create();
            mat4.fromQuat(rotate, rot);
            mat4.fromTranslation(translate, pos);

            

           //console.log(translate);
            mat4.fromScaling(scalation, scalar);
           // mat4.multiply(scalation, movePivot, scalation);
            // mat4.multiply(transform, rotate, translate);
            // mat4.multiply(transform, transform, scalation);



            // mat4.multiply(rotate, rotate, movePivot);
            mat4.multiply(rotate, rotate, scalation);
            mat4.multiply(transform, translate, rotate);


            // mat4.multiply(translate, scalation, translate);
            // mat4.multiply(transform, rotate, translate);


            //if the grammar is F, meaning that we need to show it on the screen
            if(this.isMesh)
            //if(grammar[i] == 'F' || grammar[i] == '-' || grammar[i] == '+')
            {

                this.curSQ.transArray1.push(transform[0] );
                this.curSQ.transArray1.push(transform[1]);
                this.curSQ.transArray1.push(transform[2]);
                this.curSQ.transArray1.push(transform[3] );

                this.curSQ.transArray2.push(transform[4]);
                this.curSQ.transArray2.push(transform[5] );
                this.curSQ.transArray2.push(transform[6]);
                this.curSQ.transArray2.push(transform[7] );
                
                this.curSQ.transArray3.push(transform[8]);
                this.curSQ.transArray3.push(transform[9]);
                this.curSQ.transArray3.push(transform[10]);
                this.curSQ.transArray3.push(transform[11]);

                this.curSQ.transArray4.push(transform[12] );
                this.curSQ.transArray4.push(transform[13] );
                this.curSQ.transArray4.push(transform[14] );
                this.curSQ.transArray4.push(transform[15]);
  
            }
        }

        //let offsets: Float32Array = new Float32Array(offsetsArray);
        let array1: Float32Array = new Float32Array(sq.transArray1);
        let array2: Float32Array = new Float32Array(sq.transArray2);
        let array3: Float32Array = new Float32Array(sq.transArray3);
        let array4: Float32Array = new Float32Array(sq.transArray4);

        sq.setInstanceVBOs1(array1, array2, array3, array4);
        sq.setNumInstances(count); // grid of "particles"

        //p.create();
    }

};