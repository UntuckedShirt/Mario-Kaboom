kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

    // allows keyboard functions

    const MOVE_SPEED = 120
    const JUMP_FORCE = 360
    const BIG_JUMP_FORCE = 550
    let CURRENT_JUMP_FORCE = JUMP_FORCE
    let isJumping = true
    const FALL_DEATH = 400
    

loadRoot('https://i.imgur.com/')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('evil-shroom', 'KPO3fR9.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'M6rwarW.png')
loadSprite('mario', 'Wb1qfhK.png')
loadSprite('shroom', '0wMd92p.png')
loadSprite('surprise-box', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')

loadSprite('blue-block', 'fVscIbn.png')
loadSprite('blue-brick', '3e5YRQd.png')
loadSprite('blue-steel', 'gqVoI2b.png')
loadSprite('blue-evil-shroom', 'SvV4ueD.png')
loadSprite('blue-surprise', 'RMqCc1G.png')

// grid of the world for player and sprites
scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const maps = [
        [
        '                                                       ',
        '                                                       ',
        '                                                       ',
        '                                                       ',
        '                                                       ',
        '                                                       ',
        '       *%  =*=%=                                       ',
        '                                                       ',
        '                                               -+      ',
        '                                                       ',
        '      ^   ^           ^   ^     ^          ^ ^ ()      ',
            '============   ====================  ================== ===========    ==========',
        ],
        [
        '                                                       ',
        '                                                       ',
        '                                                       ',
        '                                                       ',
        '                                                       ',
        '                                                       ',
        'eee       @@@@@@@@@                                    ',
        'eeee                                                   ',
        '                                               -+      ',
        '                                      x    x           ',
        '      z   zz          z        z    x x z z z x x       ',
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',

        ]
    ]
 
    // sprites added into world with symbols
    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()],
        '!': [sprite('blue-block'), solid(), scale(0.5)],
        '$': [sprite('coin'), 'coin'],
        '*': [sprite('surprise-box'), solid(), 'coin-surprise'],
        '@': [sprite('blue-surprise'), solid(), scale(0.5),'coin-surprise'],
        '%': [sprite('surprise-box'), solid(), 'shroom-surprise'],
        '}': [sprite('unboxed'), solid()],
        '(': [sprite('pipe-bottom-left'), solid(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(0.5), 'pipe'],
        '-': [sprite('pipe-top-left'), solid(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(0.5)],
        '^': [sprite('evil-shroom'), solid(), 'dangerous'],
        'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
        '#': [sprite('shroom'), solid(), 'shroom', body()],
        'e': [sprite('blue-brick'), solid(), scale(0.5)],
        'x': [sprite('blue-steel'), solid(), scale(0.5)],
        

    }
    
    const gameLevel = addLevel(maps[level], levelCfg)
// adds a score in teh top left corner
    const scoreLabel = add([
        text(score),
        pos(30, 6),
        layer('ui'),
        {
            value: 'score',
        }
    ])

    add([text('level ' + parseInt(level +1)), pos(40, 6)])

    function big() {
        let timer = 0
        let isBig = false
        return {
            update() {
                if (isBig) {
                    CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
// dt is a kaboom method
                    timer -= dt()
                    if (timer <= 0) {
                        this.smallify()
                    }
                }
            },
            isBig() {
                return isBig
            },
            smallify() {
                this.scale = vec2(1)
                CURRENT_JUMP_FORCE = JUMP_FORCE
                timer = 0
                isBig = false
            },
            biggify() {
                this.scale = vec2(2)
                timer = time
                isBig = true
            }
        }
    }

    // adds sprite to world and sets position
    const player = add([
        sprite('mario'), solid(),
        pos(30, 0),
        body(),
        big(),
        origin('bot')
    ])
//controls mushroom speed
    action('shroom', (m) => {
        m.move(50, 0)
    })

    player.on("headbump", (obj) => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))
        }
        if (obj.is('shroom-surprise')) {
            gameLevel.spawn('#', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))
        }
    })

    player.collides('shroom', (m) => {
        destroy(m)
        player.biggify(6)
    })

    player.collides('coin', (c) => {
        destroy(c)
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value
    })

const ENEMY_SPEED = 20

    action('dangerous', (d) => {
        d.move(-ENEMY_SPEED, 0)
    })

    player.collides('dangerous', (d) => {
        if (isJumping) {
            destroy(d)
        } else {
            go('lose', { score: scoreLabel.value })
        }
    })

    player.action(() => {
        camPos(player.pos)
        if (player.pos.y >= FALL_DEATH) {
            go('lose', { score: scoreLabel.value})
        }
    })

    player.collides('pipe', () => {
        keyPress('down', () => {
            go('game', {
                level: (level +1) % maps.length,
                score: scoreLabel.value
            })
        })
    })


    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })
    
    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })

    player.action(() => {
        if(player.grounded()) {
        isJumping = false
        }
    })
    
    keyPress('space', () => {
        if (player.grounded()) {
            isJumping = true
            player.jump(CURRENT_JUMP_FORCE)
        }
    })

})

scene('lose', ({ score }) => {
    add([text(score, 32), origin('center'), pos(width()/2, height()/ 2)])
})


start("game", { level: 0, score: 0 })