
import { Actor, mix, AM_Spatial, q_axisAngle} from '@croquet/worldcore';
import {InstanceActor} from './Instance.js';
import { CELL_SIZE, seasons } from '../labyrinth.js';
const PI_2 = Math.PI/2;

// Maze Generator
// This generates a (mostly) braided maze. That is a kind of maze that should have no dead ends.
// This actually does have dead ends on the edges, but I decided to leave it as is.
//------------------------------------------------------------------------------------------
class MazeActor extends mix(Actor).with(AM_Spatial) {
    init(options) {
        super.init(options);
        this.rows = options._rows || 20;
        this.columns = options._columns || 20;
        this.cellSize = options._cellSize || 20;
        this.seasons = {"Spring": 0, "Summer": 0, "Autumn": 0, "Winter": 0};
        this.createMaze(this.rows,this.columns);
        this.constructMaze();
        this.startMinutes = this.minutes;
        this.timer = this.minutes*60000;
        this.future(1000).countDown();
        this.subscribe("game", "reset", this.reset);
    }

    // Reset the maze to start a new game.
    reset() {
        this._minutes = this.startMinutes;
        this.seasons = {"Spring": 0, "Summer": 0, "Autumn": 0, "Winter": 0};
        if (this.timer===0) this.future(1000).countDown();
        this.timer = this.minutes*60000;
        this.instances.forEach(instance => instance.destroy());
        this.instances = [];
        this.createMaze(this.rows,this.columns);
        this.constructMaze();
        this.publish("maze", "score", this.seasons);
        this.future(1000).publish("maze", "reset");
    }

    get minutes() {return this._minutes || 8}

    countDown() {
        this.timer -= 1000;
        if (this.timer <= 0)
            {
                this.timer = 0;
                this.publish("maze", "victory", this.seasons);
            }
        else this.future(1000).countDown();
        this.publish("maze", "countDown", this.timer);
    }
  
    createMaze(width, height) {
      this.map = [];
      this.DIRECTIONS = {
        'N' : { dy: -1, opposite: 'S' },
        'S' : { dy:  1, opposite: 'N' },
        'E' : { dx:  1, opposite: 'W' },
        'W' : { dx: -1, opposite: 'E' }
      };
      this.WIDTH = width || 20;
      this.HEIGHT = height || 20;
      this.prefill();
      this.carve(this.WIDTH/2, this.HEIGHT/2, 'N');
      //console.log(this.output()); // if braid making holes?
      this.braid();
      this.flip();
      this.clean();
      console.log("New Maze");
      console.log(this.output());
    }

    // initialize it with all walls on
    prefill() {
      for (let x = 0; x < this.WIDTH; x++) {
        this.map[x] = [];
        for (let y = 0; y < this.HEIGHT; y++) {
          this.map[x][y] = {};
        }
      }
    }

    // shuffle which direction to search
    shuffle(o) {
      for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    }

    // carve away a wall - don't go anywhere we have already been
    carve(x0, y0, direction) {
        const x1 = x0 + (this.DIRECTIONS[direction].dx || 0),
          y1 = y0 + (this.DIRECTIONS[direction].dy || 0);

      if (x1 === 0 || x1 === this.WIDTH || y1 === 0 || y1 === this.HEIGHT) {
        return;
      }

      if ( this.map[x1][y1].seen ) {
        return;
      }

      this.map[x0][y0][ direction ] = true;
      this.map[x1][y1][ this.DIRECTIONS[direction].opposite ] = true;
      this.map[x1][y1].seen = true;

      const directions = this.shuffle([ 'N', 'S', 'E', 'W' ]);
      for (let i = 0; i < directions.length; i++) {
        this.carve(x1, y1, directions[i]);
      }
    }

    flip() {
      for(let y=0; y<this.HEIGHT/2+1; y++) {
        for(let x=0; x<this.WIDTH; x++) {
          const cellFrom = this.map[x][y];
          const cellTo = this.map[x][this.HEIGHT-y];
          if(cellTo) {
            cellTo.S = cellFrom.N?true:undefined;
            cellTo.N = cellFrom.S?true:undefined;
            cellTo.E = cellFrom.E; //cellFrom.W?true:null;
            cellTo.W = cellFrom.W; //cellFrom.E?true:null;
          }
        }
      }

      for(let y=1; y<this.HEIGHT; y++) {
        for(let x=1; x<this.WIDTH/2+1; x++) {
          const cellFrom = this.map[x][y];
          console.log("cellTo", this.WIDTH-x,y);
          const cellTo = this.map[this.WIDTH-x][y];
          if(cellTo) {
            cellTo.S = cellFrom.S;
            cellTo.N = cellFrom.N;
            cellTo.E = cellFrom.W?true:undefined;
            cellTo.W = cellFrom.E?true:undefined;
          }
        }
      }
    }

    // remove cull-de-sacs. This is incomplete, a few may remain along the edges
    braid() {
      for (let y = 2; y < this.HEIGHT-1; y++) {
        for (let x = 2; x < this.WIDTH-1; x++) {

          if (x>1 && !(this.map[x][y].S || this.map[x][y].E || this.map[x][y].N)) {
            this.map[x][y].E = true;
            this.map[x+1][y].W = true;
          }
          if (y>1 && !(this.map[x][y].E || this.map[x][y].N || this.map[x][y].W)) {
            this.map[x][y].N = true;
            this.map[x][y-1].S = true;
          }
          if (!(this.map[x][y].N || this.map[x][y].W || this.map[x][y].S)) {
            this.map[x][y].W = true;
            this.map[x-1][y].E = true;
          }
          if (!(this.map[x][y].W || this.map[x][y].S || this.map[x][y].W)) {
            this.map[x][y].S = true;
            this.map[x][y+1].N = true;
          }
        }
      }
    }

    // dump most of the data - don't need it anymore
    clean() {
        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
            delete this.map[x][y].seen;
            }
        }

        // the horse is in the center of the maze so add walls around it and remove walls nearby
        // a value of false means there is a wall
        const center = 10;
        this.placeStatue(center,center, true);
        this.placeStatue(center, 5);
        this.placeStatue(center, 15);
        this.placeStatue(5, center);
        this.placeStatue(15, center);

        // add an opening along the edge hallways
        this.map[center][1].S = this.map[center][2].N = true; 
        this.map[center][19].N =this.map[center][18].S = true;
        this.map[1][center].E = this.map[2][center].W = true;
        this.map[19][center].W = this.map[18][center].E = true;

        this.clearCorner(0,0, "Spring");
        this.clearCorner(this.WIDTH-3,0,"Winter");
        this.clearCorner(0,this.HEIGHT-3,"Summer");
        this.clearCorner(this.WIDTH-3,this.HEIGHT-3,"Autumn");

        //
        //this.map[x][y].E = this.map[x][y].W =this.map[x-1][y].E = this.map[x+1][y].W = !walls;
    }
  
    placeStatue(x,y, walls=false){
      const cell = this.map[x][y];
      cell.N = cell.S = cell.E = cell.W = false;
      // four walls around the statue
        this.map[x][y].S = this.map[x][y].N =this.map[x][y-1].S = this.map[x][y+1].N = !walls;
        this.map[x][y].E = this.map[x][y].W =this.map[x-1][y].E = this.map[x+1][y].W = !walls;

      // clear area around the statue
      this.map[x-1][y-1].S = this.map[x-1][y].N = this.map[x-1][y].S = this.map[x-1][y+1].N = true;
      this.map[x+1][y-1].S = this.map[x+1][y].N = this.map[x+1][y].S = this.map[x+1][y+1].N = true;
      this.map[x-1][y-1].E = this.map[x][y-1].W = this.map[x][y-1].E = this.map[x+1][y-1].W = true;
      this.map[x-1][y+1].E = this.map[x][y+1].W = this.map[x][y+1].E = this.map[x+1][y+1].W = true;
      if (walls) {
        this.map[x][y+1].S = this.map[x][y-1].N =this.map[x][y-2].S = this.map[x][y+2].N = true;
        this.map[x+1][y].E = this.map[x-1][y].W =this.map[x-2][y].E = this.map[x+2][y].W = true;
      }
      //this.map[x][y-2].E = this.map[x][y-1].W = false;
    }

  
    clearCorner(x,y, season){
      this.map[x+1][y+2].N = this.map[x+1][y+1].S =
      this.map[x+2][y+2].N = this.map[x+2][y+1].S = true;
      this.map[x+1][y+1].E = this.map[x+2][y+1].W =
      this.map[x+1][y+2].E = this.map[x+2][y+2].W = true;
      this.setCornerSeason(x,y,season);
    }

    setCornerSeason(x,y, season) {
        // set the corners of the cell to the season
        const cell = this.map[x][y];
        if (cell.floor) { // only do this if the floor exists
            // console.log("setColor", cell, x,y, season);
            this.map[x][y].season = season;
            this.map[x][y].floor.setSeason(season, true);
            this.map[x+1][y].season = season;
            this.map[x+1][y].floor.setSeason(season, true);
            this.map[x][y+1].season = season;
            this.map[x][y+1].floor.setSeason(season, true);
            this.map[x+1][y+1].season = season;
            this.map[x+1][y+1].floor.setSeason(season, true);
        }
        else this.future(100).setCornerSeason(x,y,season);
    }

    // you can't claim a corner
    checkCornersSeason(x, y) {
        //console.log("checkCornersSeason", x, y, this.map[x][y].season, x<2 && y<2);
        if ( x < 2 && y < 2 ) return this.map[x][y].season;
        if ( x < 2 && y >= this.HEIGHT-3 ) return this.map[x][y].season;
        if ( x >= this.WIDTH-3 && y < 2 ) return this.map[x][y].season;
        if ( x >= this.WIDTH-3 && y >= this.HEIGHT-3 ) return this.map[x][y].season;
        return false;
    }

    // this lets me see the maze in the console
    output() {
      let output = '\n';
      for (let y = 0; y < this.HEIGHT; y++) {
        for (let x = 0; x < this.WIDTH; x++) {
          if (x>0)output += ( this.map[x][y].S ? ' ' : '_' );
          output += ( this.map[x][y].E ? ' ' : y===0?' ':'|' );
        }
        output += '\n';
      }
      output = output.replace(/_ /g, '__');
      return output;
    }

    setSeason(x,y, season, avatarId) {
        // console.log("setSeason", x,y, season);
        const cell = this.map[x-1][y-1];
        const oldSeason = cell.season;
        if ( season !== oldSeason ) {
          if(this.seasons[season] === 0) this.seasons[season]=4;
          this.seasons[season]++;
          cell.season = season;
          cell.floor.setSeason(season);
          // This is literally the attack line. Where you can win or lose in an instant.
          if (oldSeason) this.seasons[oldSeason] = this.checkLife(oldSeason, avatarId);
          this.publish("maze", "score", this.seasons);
          return true;
        }
        return false;
    }

    getSeason(x,y) {
      // console.log("getSeason", x,y);
        return this.map[x-1][y-1].season;
    }

    getCell(x,y) {
        return this.map[x-1][y-1];
    }

    checkLife(season, avatarId) {
        //uses a fill algorithm to check if the season tree has been cut.
        const r = Math.random();
        const oldCount =this.seasons[season];
        const count = this.floodTest(season,r, seasons[season].cell.x, seasons[season].cell.y);
        if (oldCount-1 !== count) {
            const clearCells = [];
            for (let y = 0; y < this.HEIGHT; y++) {
                for (let x = 0; x < this.WIDTH; x++) {
                    if (this.map[x][y].season === season && this.map[x][y].testValue !== r) {
                        this.map[x][y].season = null;
                        this.map[x][y].floor.setSeason("none");
                        clearCells.push([x,y]);
                    }
                }
            }
            this.publish("maze", "clearCells", {clearCells, avatarId});
        }
        return count;
    }

    floodTest(season, r, x,y) {
        // console.log("floodTest", season, r, x,y);
        if (x<0 || x>=this.WIDTH-1 || y<0 || y>=this.HEIGHT-1) return 0;
        if (this.map[x][y].season !== season) return 0;
        if (this.map[x][y].testValue === r) return 0;
        this.map[x][y].testValue = r;
        let count = 1;
        count += this.floodTest(season, r, x+1,y);
        count += this.floodTest(season, r, x-1,y);
        count += this.floodTest(season, r, x,y+1);
        count += this.floodTest(season, r, x,y-1);
        return count;
    }

    getCellSeason(x,y) {
        const cell = this.map[x-1][y-1];
        return cell.season;
    }

    constructMaze() {
        const r = q_axisAngle([0,1,0],PI_2);
        const ivyRotation = q_axisAngle([0,1,0],Math.PI);
        let ivy0Count = 0, ivy1Count = 0, floorCount = 0, wallCount2 = 0, columnCount = 0;
        //const wallCount = this.countWalls();
        this.instances = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                if (x<this.columns-1 && y<this.rows-1) {
                    this.map[x][y].floor = InstanceActor.create({name:"floor", translation: [x*CELL_SIZE+CELL_SIZE/2, 0, y*CELL_SIZE+CELL_SIZE/2], max:391});
                    this.instances.push(this.map[x][y].floor);
                    floorCount++;
                }
                const t = [x*CELL_SIZE, 0, y*CELL_SIZE];
                this.instances.push(InstanceActor.create({name:"column", color:0xFFA07A,translation: t}));
                columnCount++;
                // south walls
                if (!this.map[x][y].S && x>0) {
                const t = [x*this.cellSize - this.cellSize/2, 0, y*this.cellSize];
                const wall = InstanceActor.create({name:"wall", parent: this, translation: t});
                this.instances.push(wall);
                wallCount2++;
                if (Math.random() < 0.25) {
                    this.instances.push(InstanceActor.create({name: "ivy0", parent: wall}));
                    this.instances.push(InstanceActor.create({name: "ivy1", parent: wall}));
                    this.instances.push(InstanceActor.create({name: "ivy0", parent: wall, rotation:ivyRotation}));
                    this.instances.push(InstanceActor.create({name: "ivy1", parent: wall, rotation:ivyRotation}));
                    ivy0Count+=2;
                    ivy1Count+=2;
                }
            }
            // east walls
            if (!this.map[x][y].E && y>0) {
                const t = [x*this.cellSize, 0, (y+1)*this.cellSize - 3*this.cellSize/2];
                const wall = InstanceActor.create({name:"wall",parent: this, translation: t, rotation: r});
                this.instances.push(wall);
                wallCount2++;
                if (Math.random() < 0.25) {
                    this.instances.push(InstanceActor.create({name: "ivy0", parent: wall}));
                    this.instances.push(InstanceActor.create({name: "ivy1", parent: wall}));
                    this.instances.push(InstanceActor.create({name: "ivy0", parent: wall, rotation:ivyRotation}));
                    this.instances.push(InstanceActor.create({name: "ivy1", parent: wall, rotation:ivyRotation}));
                    ivy0Count+=2;
                    ivy1Count+=2;
                }
            }
        }
      }
      // console.log("Maze Constructed wallCount: ", wallCount, wallCount2, "columnCount", columnCount, "ivyCount: ", ivy0Count,   "floorCount: ", floorCount);
    }

    countWalls() {
      let wallCount = 0;
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.columns; x++) {
              // south walls
              if (!this.map[x][y].S && x>0) wallCount++;
              // east walls
              if (!this.map[x][y].E && y>0) wallCount++;
        }
      }
      return wallCount;
    }
 }
MazeActor.register("MazeActor");

export { MazeActor as default };