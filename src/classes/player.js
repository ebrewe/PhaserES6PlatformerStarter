import {PLAYER_STATE, ATTACK_STATE} from './stateDefinitions';

//PLAYER CLASS
class Player extends Phaser.Sprite{
  constructor(game, x,y,sprite, settings={}, cursor={}){
    super(game,x, y, sprite,0);
    this.anchor.setTo(0.5, 1);

    this.width = 40;
    this.height= 50;
    this.scale.x = 1;
    this.settings = settings;
    //this.cursor = cursor;
    this.cursor = {
      left:this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      right:this.game.input.keyboard.addKey(Phaser.Keyboard.F),
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
      jump: this.game.input.keyboard.addKey(Phaser.Keyboard.K),
      attack: this.game.input.keyboard.addKey(Phaser.Keyboard.J)
    }

    //projectiles

    this.points = 0;
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = this.settings.gravity;

    this.invincible =false;

    this.playerState = this.setState(PLAYER_STATE.IDLE);


    //animations
    //this.animations.add('stand', [6], 4, false);
    //this.animations.add('run', [5,4,5,3,2,3], 14, true);

  }
  update(){
    this.grounded = this.body.blocked.down;

    this.movePlayer();
    this.playerState = this.setState(this.playerState);

    //State Mods
    this.animate();
    this.alpha = this.invincible ? 0.3 + (Math.random() * 0.5) : 1;

  }//player update

  setState(state){

    if(this.grounded){
      if(this.body.velocity.x <= 5 && this.body.velocity.x >= -5){
        return PLAYER_STATE.IDLE;
      }else{
        return PLAYER_STATE.WALKING;
      }
      return state;
    }else{
      return this.body.velocity.y > 0 ? PLAYER_STATE.FALLING : PLAYER_STATE.JUMPING;
    }
    return state; //just in case
  }


  movePlayer(){
    if(this.inputDisabled) {
      return false;
    }

    if(this.cursor.right.isDown){
      this.scale.x = 1;
      this.body.velocity.x = this.settings.speed;
    }
    if(this.cursor.left.isDown){
      this.scale.x = -1;
      this.body.velocity.x = -this.settings.speed;
    }
    if(!this.cursor.left.isDown && !this.cursor.right.isDown){
      this.body.velocity.x = (this.body.velocity.x > 5 || this.body.velocity.x < -5) ? this.body.velocity.x * 0.8 : 0;
    }

    if(this.cursor.jump.isDown){
      if(this.grounded && !this.holdingJump && this.playerState != PLAYER_STATE.ATTRACTING && this.playerState!=PLAYER_STATE.REPELLING){
        this.holdingJump = true;
        this.body.velocity.y = -this.settings.jumpPower;
      }
    }



    //keyup callback for controlled jumps, etc
    this.game.input.keyboard.onUpCallback = (e)=>{
      if(e.keyCode == this.cursor.jump.keyCode){
        this.holdingJump = false;
        if(this.playerState != PLAYER_STATE.FALLING){
          this.body.velocity.y = 0;
        }
      }
    }


  }//movement

  animate(){

  }//animation

  takeDamage(amount){
    if(this.invincible){
      return false;
    }
    this.hp -= amount;
    if(this.hp <= 0){
      this.kill();
    }
  }
  disableInput(){
    this.inputDisabled = true;
  }
  enableInput(){
    this.inputDisabled = false;
  }
  setInvincible(time=1500){
    this.invincible = true;
    this.game.time.events.add(time, ()=>{
      this.invincible = false;
    })
  }
}
export default Player;
