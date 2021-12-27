import Interface from './interface.js'
import Game from './game.js'
import './main.css';

class Main {
  constructor() {
    // interface
    this.interface = new Interface(this);

    // game
    this.game = null;

    // instructions
    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('class', 'wrapper');
    document.body.appendChild(this.wrapper);

    this.instructions = document.createElement('h1');
    this.instructions.innerText = 'Loading...';
    this.wrapper.appendChild(this.instructions);

    // tongue icon
    this.tongue = document.createElement('div');
    this.tongue.setAttribute('class', 'tongue loading');
    this.tongue.innerText = '👅';
    this.wrapper.appendChild(this.tongue);

    // count down
    this.count = document.createElement('div');
    this.count.setAttribute('class', 'count');
    document.body.appendChild(this.count);

    // training progress
    this.progress = document.createElement('div');
    this.progress.setAttribute('class', 'progress');
    document.body.appendChild(this.progress);
  }

  playGame() {
    this.instructions.innerText = 'Play Game !';
    this.tongue.setAttribute('class', 'play tongue');
    this.interface.view.setAttribute('class', 'view');
    this.count.innerText = '';
    this.interface.playing = true;
    this.game = new Game(this);
  }
}

window.addEventListener('load', () => new Main());
