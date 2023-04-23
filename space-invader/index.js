const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor() {
        const img = new Image();
        img.src = './assets/spaceship.png'
        this.scale = .15
        
        this.rotation = 0
        this.velocity = {
            x: 0,
            y: 0
        }

        // When img is loaded, setup for player will be activated in callback function
        img.onload = () => {
            this.image = img
            this.width = img.width * this.scale
            this.height = img.height * this.scale

            this.position = {
                x: (canvas.width / 2) - (this.width / 2),
                y: canvas.height - this.height
            }
        }
    }

    draw() {
        c.save()
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)

        c.rotate(this.rotation)

        c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        c.restore()
    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        )
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader {
    constructor({ position }) {
        const img = new Image();
        img.src = './assets/invader.png'
        this.scale = 1
        
        this.velocity = {
            x: 0,
            y: 0
        }

        // When img is loaded, setup for player will be activated in callback function
        img.onload = () => {
            this.image = img
            this.width = img.width * this.scale
            this.height = img.height * this.scale

            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update({ velocity }) {
        if (this.image) {
            this.draw();
            // this.position.y += velocity.y
            
            if (this.position.x + this.width >= 200) {
                // this.position.x -= velocity.x
                // console.log(this.position, this.width);
            } else {
                // this.position.x += velocity.x
                // console.log(this.position, this.width);
            }
        }
    }
}

class Grid {
    constructor({ totalInvaders, numberOfInvaderPerLine, lineOfEnemies }) {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.invaders = Array(totalInvaders);

        this.width = numberOfInvaderPerLine * 50

        let maxInvaderPerLine = 0;
        let index = 0
        let yAxis = 0

        while(index < this.invaders.length && yAxis < lineOfEnemies) {
            this.invaders[index] = new Invader({
                position: {
                    x: maxInvaderPerLine * 50,
                    y: yAxis * 50
                }
            })
            index++;
            maxInvaderPerLine++
            if (maxInvaderPerLine > numberOfInvaderPerLine) {
                maxInvaderPerLine = 0
                yAxis++
            }
        }
    }

    update({ velocity }) {
        this.position.x += velocity.x
        this.position.y += velocity.y
        
        const state = ((this.position.x + this.width) > canvas.width - 50)
        
        if (state) {
            this.velocity.x = -velocity.x
        } else {
            this.velocity.x = velocity.x
        }

        
        this.invaders.forEach(invader => invader.update({ velocity: this.velocity }));
    }
}

const player = new Player();
const invader = new Invader({ position: { x: 0, y: 0 }})
const control = {
    left: {
        value: 'a',
        pressed: false
    },
    right: {
        value: 'd',
        pressed: false
    },
    fire: {
        value: ' ',
        pressed: false
    }
}
const ammos = [
]
const grids = [
    new Grid({ totalInvaders: 200, numberOfInvaderPerLine: 19, lineOfEnemies: 5 })
]

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height)
    
    player.update()

    ammos.forEach((ammo, index) => {
        if (ammo.position.y + ammo.radius <= 0) {
            setTimeout(() =>  ammos.splice(index, 1), 0)
        } else {
            ammo.update()
        }
    })

    // grids.forEach(grid => {
    //     grid.update({ velocity: { x: 1, y: 0 }})
    // })

    invader.update({ velocity: { x: .5, y: 0 }})

    if (control.left.pressed && player.position.x >= 0) {
        player.velocity.x = -5
        player.rotation = -.20
    } else if (control.right.pressed && (player.position.x + player.width) <= canvas.width) {
        player.velocity.x = 5
        player.rotation = .20
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }
}

animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case control.left.value:
            control.left.pressed = true
            break;
    
        case control.right.value:
            control.right.pressed = true
            break;

        case control.fire.value:
            ammos.push(new Projectile({
                position: {
                    x: player.position.x + (player.width / 2),
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -15
                }
            }))
            break;
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case control.left.value:
            control.left.pressed = false
            break;
    
        case control.right.value:
            control.right.pressed = false
            break;

        case control.fire.value:
            control.fire.pressed = false
            break;
    }
})
