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
    gridGrammar: String;
    // grammars: Array<String> = ['X'];
    grammars: Array<String> = ['A'];
    gridGrammars: Array<String> = ['X'];
    iteration: number;
    gridIter: number;
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
        this.iteration = 2;
        this.gridIter = 5;
        this.expanse.setRules();
        this.drawing.setRule();
        this.num = 1.0;
        this.isMesh = false;
        this.grammar = 'X';
        this.gridGrammar = 'X';
    }

    getRandomInt(max : number) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    test() {
        console.log("check \n")
    }

    expansion()
    {
        //console.log('grammar array size: ' + this.grammars.length);
        //if haven't iterated so much

        this.grammar = '';
        for(var i = 0; i < this.iteration; i++)
        {
            this.grammar += 'BABA';
        }


        return this.grammar;

    }

    expensionGrid()
    {
        var itr = this.gridIter * 5;
        if(itr >= this.gridGrammars.length)
        {

            //console.log('check cur iteration: ' + this.iteration);
            //find the last expanded grammar 
            var lastIndex = this.gridGrammars.length - 1;

            //calculate how much more iterations are needed 
            var moreIteration = itr - this.gridGrammars.length;

            for(var i = lastIndex; i < itr; i++)
            {
                let last = this.gridGrammars[lastIndex];
                // console.log('lst is:' + last); 
                let newStr = '';
                for(var j = 0; j < last.length; j++)
                {
                    newStr += this.expanse.expanse(last[j]);
                }

                //console.log('newStr is: ' + newStr);
                //push the new string to the grammar list 
                this.gridGrammars.push(newStr);
                //update the last index
                lastIndex++;
            }

            return this.gridGrammars[lastIndex];
        }
        else
        {
            return this.gridGrammars[itr];
        }
        
        return this.gridGrammar;
    }

    draw(m : Mesh, p:Mesh, angle:number)
    {

        let count = 0;
        let count1 = 0;

        var grammar = this.expansion();
        this.drawing.ang = angle;


        
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



    drawMap(sq : Square, sq1: Square, flag: number)
    {
        if(flag == 0)
        {
            this.drawRoad(sq);
        }
        if(flag == 1)
        {
            this.drawGrid(sq1);
        }
        if(flag == 2)
        {
            this.drawRoad(sq);
            this.drawGrid(sq1);
        } 
        
    }


    drawRoad(sq : Square)
    {

        let count = 0;

        var grammar = this.expansion();
        //grammar = 'BABABABABABABABABA';

        var gridGram = this.expensionGrid();


        

        var prePos = vec2.fromValues(0, 0);

        //draw highway
        for(var i = 0; i < grammar.length; i++)
        {
            
            this.drawing.draw(grammar[i]);
            this.isMesh = false;

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


            let transPivot = vec3.fromValues(0, -length/2.0, 0);
            let movePivot = mat4.create();
            mat4.fromTranslation(movePivot, transPivot);

        
            //translatePos = vec3.fromValues(test[0], test[1], 0);    
            let transform = mat4.create();
            let rotate = mat4.create();
            let translate = mat4.create();
            let scalar = vec3.fromValues(0.03, length, 0);

            let scalation = mat4.create();
            mat4.fromQuat(rotate, rot);
            mat4.fromTranslation(translate, pos);

            

           //console.log(translate);
            mat4.fromScaling(scalation, scalar);


           
            mat4.multiply(transform, scalation, transform);
            mat4.multiply(transform, movePivot, transform);
            mat4.multiply(transform, rotate, transform);
            mat4.multiply(transform, translate, transform);


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

       var roadPos = vec3.fromValues(0, 0, 0);
        if(this.drawing.roads.length != 0)
        {
           var roadPick = this.getRandomInt(this.drawing.roads.length);
           var road = this.drawing.roads[roadPick];
           roadPos = this.drawing.roads[roadPick][0];
        }
         
        //count += this.drawGrid(sq, roadPos);
        //var countGrid2 = this.drawGrid(sq, roadPos);

        //let offsets: Float32Array = new Float32Array(offsetsArray);

        //count += this.drawGrid(sq);


        let array1: Float32Array = new Float32Array(sq.transArray1);
        let array2: Float32Array = new Float32Array(sq.transArray2);
        let array3: Float32Array = new Float32Array(sq.transArray3);
        let array4: Float32Array = new Float32Array(sq.transArray4);

        sq.setInstanceVBOs1(array1, array2, array3, array4);
        sq.setNumInstances(count); // grid of "particles"
        //p.create();
    }



    drawGrid(sq: Square)
    {

        var gridGram = this.expensionGrid();
        var prePos = vec2.fromValues(0, 0);

        var count = 0;

        for(var i = 0; i < gridGram.length; i++)
        {
            
            this.drawing.draw(gridGram[i]);

            //this.drawing.sca = 5.0 / this.num;

            

            let pos = this.drawing.curGrid.position;
            let rot = this.drawing.curGrid.orientation;
            let pre = this.drawing.curGrid.prevPos;

            // vec3.add(pos, pos, roadPos);
            // vec3.add(pre, pre, roadPos);

            let pos_2 = vec2.fromValues(this.drawing.curGrid.position[0], this.drawing.curGrid.position[1]);
            var a = pos[0] - pre[0];
            var b = pos[1] - pre[1];
            var length = Math.sqrt(a * a + b * b);


            var test = vec3.fromValues(0, 0, 0);
            vec3.subtract(test, pos, pre);
            test = vec3.fromValues(test[0] / 2.0, test[1] / 2.0, 0);
            
            let radii = 1.0;
            
            if(gridGram[i] == 'G' || gridGram[i] == '-' || gridGram[i] == '+')
            {   
                count ++;
                radii = 2.0;
                this.isMesh = true;
                this.curSQ = sq;
            }

            if(this.drawing.map.getDensity(pos) < -0.3)
            {
                this.isMesh = false;
            }


            let translatePos = vec3.fromValues(0, 0, 0);
            vec3.subtract(translatePos, pos, pre);


            length = 0.1;
            let transPivot = vec3.fromValues(0, -length/2.0, 0);
           // vec3.add(transPivot, transPivot, roadPos);
            let movePivot = mat4.create();
            mat4.fromTranslation(movePivot, transPivot);

        
            //translatePos = vec3.fromValues(test[0], test[1], 0);    
            let transform = mat4.create();
            let rotate = mat4.create();
            let translate = mat4.create();
            let scalation = mat4.create();
            let roadTrans = mat4.create();

            let scalar = vec3.fromValues(0.01, length, 0);

            
            mat4.fromQuat(rotate, rot);

            //vec3.add(pos, roadPos, pos);

            mat4.fromTranslation(translate, pos);
            //mat4.fromTranslation(roadTrans, roadPos);
            mat4.fromScaling(scalation, scalar);


           
            mat4.multiply(transform, scalation, transform);
            mat4.multiply(transform, movePivot, transform);
            
            mat4.multiply(transform, rotate, transform);
            mat4.multiply(transform, translate, transform);
            //mat4.multiply(transform, roadTrans, transform);


            // mat4.multiply(translate, scalation, translate);
            // mat4.multiply(transform, rotate, translate);


            //if the grammar is F, meaning that we need to show it on the screen
            if(this.isMesh)
            //if(gridGram[i] == 'F' || gridGram[i] == '-' || grammar[i] == '+')
            //if(gridGram[i] == 'G')
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

                this.curSQ.transArray4.push(transform[12]);
                this.curSQ.transArray4.push(transform[13] );
                this.curSQ.transArray4.push(transform[14] );
                this.curSQ.transArray4.push(transform[15]);
  
            }
        
        }

        let array1: Float32Array = new Float32Array(sq.transArray1);
        let array2: Float32Array = new Float32Array(sq.transArray2);
        let array3: Float32Array = new Float32Array(sq.transArray3);
        let array4: Float32Array = new Float32Array(sq.transArray4);

        sq.setInstanceVBOs1(array1, array2, array3, array4);
        sq.setNumInstances(count); // grid of "particles"

        return count;

    }

};