import { MAPS } from './levels';
import { PLAYER_STATE } from './classes/stateDefinitions';
import Player from './classes/player';

window.onload = ()=>{
  const platformer = new Platformer(800, 400, 'game');
  platformer.StartGame();
}


class Platformer extends Phaser.Game{
  constructor(gameWidth, gameHeight, container){
    super(gameWidth, gameHeight, Phaser.AUTO, container, null, false);

    this.state.add('Boot', BootState, false);
    this.state.add('Preload', PreloadState, false);
    this.state.add('Level', LevelState, false);
  }
  StartGame(){
    this.state.start('Boot');
  }
}

class BootState extends Phaser.State{
  preload(){}
  create(){ this.game.state.start('Preload')}
}
class PreloadState extends Phaser.State{
  preload(){ }
  create(){ this.game.state.start('Level', true, true, {level:0})}
}
class LevelState extends Phaser.State{
  init(levelData){
    this.currentMap = {map:MAPS[levelData.level].map, tiles:MAPS[levelData.level].tiles};
  }
  preload(){

    this.game.load.tilemap('level', this.currentMap.map, null, Phaser.Tilemap.TILED_JSON);

    this.game.load.image('tiles', this.currentMap.tiles);

  }
  create(){
    this.stage.backgroundColor = 0xe8e8e8;

    this.world.setBounds(0,0,5000, 1000);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.physics.startSystem(Phaser.Physics.P2JS);

    this.game.physics.p2.gravity.y = 1500;
    this.game.physics.p2.world.defaultContactMaterial.friction = 0.5;
    this.game.physics.p2.world.setGlobalStiffness(1e5);

    this.input = this.game.input.keyboard.createCursorKeys();

    //add groups
    this.backgroundGroup = this.game.add.group();
    this.platformGroup = this.game.add.group();
    this.entityGroup = this.game.add.group();
    this.playerGroup = this.game.add.group();
    this.effectsGroup = this.game.add.group();
    this.hudGroup = this.game.add.group();
    this.renderGroup = this.game.add.group();

    //CREATE LEVEL

     this.map = this.game.add.tilemap('level');
     //image layer in tiled, image key
     this.map.addTilesetImage('Tiles', 'tiles');
     this.layers = {};
      this.map.layers.map((layer)=>{
        this.layers[layer.name] = this.map.createLayer(layer.name)
      })
     this.map.setCollisionBetween(0, 1000);
     this.game.physics.p2.convertTilemap(this.map, this.layers.Collision);

     //Loop through and place example object
     //this.magnets = this.placeMagnets(this.map.objects.Magnets);
     //this.magnets.forEach((magnet)=>{this.magnetGroup.add(magnet); console.log(magnet.core); this.platformGroup.add(magnet.core)});

    const playerSettings = {
      speed: 150,
      jumpPower: 500,
      attackPower: 1,
      gravity: 1400,
      score:0,
      itemsCollected:[],

      abilities:{
        doubleJump:false
      }
    }
    this.player = new Player(this.game, 180, 500, 'paul', playerSettings, this.input);
    this.playerGroup.add(this.player);

    //collect groups
    this.renderGroup.add(this.backgroundGroup);
    this.renderGroup.add(this.platformGroup);
    this.renderGroup.add(this.entityGroup);
    this.renderGroup.add(this.playerGroup);
    this.renderGroup.add(this.effectsGroup);
    this.renderGroup.add(this.hudGroup);
  }
  /*placeMagnets(magnets){
    return magnets.map( (magnet)=>{
        const theType = magnet.type == "north" ? POLARITY.NORTH : POLARITY.SOUTH;
        const coreGroup = this.platformGroup;
        return new Singularity(this.game, magnet.x, magnet.y, 'magnet', theType, +(magnet.properties.strength) )});

  }*/
  //updateLoop
  update(){

    this.doCollisions();

    //camera
    this.camera.focusOnXY(this.player.x, this.player.y - 50);
  }
  doCollisions(){
    //level collisions
    this.game.physics.arcade.collide(this.player, this.layers['Collision']);
    this.game.physics.arcade.collide(this.player, this.platformGroup);

  }//collisions

  render(){
    this.game.debug.body(this.player)
  }
}
