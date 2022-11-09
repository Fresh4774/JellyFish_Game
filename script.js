const gc = document.querySelector('#game_console'),
      gc_loc = gc.getBoundingClientRect(),
      pl = document.querySelector('#player'),
      start_x = 50,
      start_y = 50,
      pl_size = 3

var plx = start_x,
    ply = start_y,
    move_speed = 1,
    e_move_speed = .25,
    spawn_rate = 10,
    attack_rate = 3, // in seconds
    bang = false,
    k = {},
    kills = 0

function randNumber() {
  return (Math.floor(Math.random()*75) + 25)
}

function spawnEnemy() {
  var e = document.createElement('div')
  e.className = 'enemy'
  var x = Math.floor(Math.random()*3) * 50,
      y = Math.floor(Math.random()*3) * 50
  e.dataset.x = x
  e.dataset.y = y
  e.style.left = x + '%'
  e.style.top = y + '%'
  e.style.setProperty('--color','hsl('+Math.random()*360+'deg, 100%, 50%)')
  
  if(x != 50 || y != 50) {
    gc.appendChild(e)  
  }  
}

function attack() {
  bang = true
  pl.classList.add('bang')
  var a = document.createElement('div')
  a.className = 'attack'
  var pl_loc = pl.getBoundingClientRect()
  a.style.left = 0
  a.style.top = 0
  a.onanimationend = function(){
    this.remove()
  }
  pl.appendChild(a)

  setTimeout(function(){
    bang = false
    pl.classList.remove('bang')
  }, attack_rate*1000)
  // setTimeout(attack, attack_rate*1000)
}

function updatePlayer() {
  var pl_loc = pl.getBoundingClientRect(),
      pl_hit = document.elementFromPoint(pl_loc.x + (pl_loc.width*.5), pl_loc.y + (pl_loc.width*.5))

  if(pl_hit.classList.contains('enemy')) {
    pl_hit.remove()
    kills = kills - 50
    if(kills < 3) {
      kills = 3
    }
  }  

  if(k['Space'] && !bang) { attack() }
  if((k['ArrowLeft'] || k['KeyA']) 
     && plx > 0) { plx = plx - move_speed; pl.classList.remove('pl_right') }
  if((k['ArrowUp'] || k['KeyW']) 
     && ply > 0) { ply = ply - move_speed }
  if((k['ArrowRight'] || k['KeyD']) 
     && plx < (100 - pl_size)) { plx = plx + move_speed; pl.classList.add('pl_right') }
  if((k['ArrowDown'] || k['KeyS']) 
     && ply < (97 - pl_size)) { ply = ply + move_speed }

  pl.style.left = plx + '%' 
  pl.style.top = ply + '%'

  var enemies = document.querySelectorAll('.enemy')
  enemies.forEach(function(elm){
    var elm_x = Number(elm.dataset.x),
        elm_y = Number(elm.dataset.y),
        elm_loc = elm.getBoundingClientRect(),
        r1 = elm_loc.width*.5,
        x1 = elm_loc.x + r1,
        y1 = elm_loc.y + r1

    if(document.querySelector('.attack')) {
      var a = document.querySelector('.attack'),
          a_loc = a.getBoundingClientRect(),
          r2 = a_loc.width*.5,
          x2 = a_loc.x + r2,
          y2 = a_loc.y+ r2
      }

    if(Math.hypot(x2-x1, y2-y1) <= (r2 + r1)) {
      kills++
      elm.remove()
    }

    if(elm_x < plx && elm_x >= 0) {
      elm_x = Math.random() < .5 ? elm_x : elm_x + e_move_speed
    } else {
      elm_x = Math.random() < .5 ? elm_x : elm_x - e_move_speed
    }

    if(elm_y < ply && elm_y >= 0) {
      elm_y = Math.random() < .5 ? elm_y : elm_y + e_move_speed
    } else {
      elm_y = Math.random() < .5 ? elm_y : elm_y - e_move_speed
    }

    elm.dataset.x = elm_x
    elm.dataset.y = elm_y

    elm.style.left = elm_x + '%'
    elm.style.top = elm_y + '%'    
  })

  if(Math.random()*100 < spawn_rate) {
    spawnEnemy()
  }
  
  document.querySelector('.kills').innerHTML = kills
  document.documentElement.style.setProperty('--attack', (kills/50)+3 )
  setTimeout(updatePlayer, 1000/60)
}

updatePlayer()

window.addEventListener('keydown', function(e){
  k[e.code] = true;
})
window.addEventListener('keyup', function(e){
  k[e.code] = false;
})

// alert('WASD or Arrows to move / Spacebar to attack')