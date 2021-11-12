kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

loadRoot('https://i.imgur.com/')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('evil-goomba', 'KPO3fR9.png')
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

// grid of the world for player and sprites
scene("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [
        '                                                       ',
        '                                                       ',
        '                                                       ',
        '                                                       ',
        '                                                       ',
        '                                                       ',
        '       %  =*=%=                                        ',
        '                                                       ',
        '                                               -+      ',
        '                                                       ',
        '      ^   ^           ^   ^     ^          ^ ^ ()      ',
        '============   ====================  ================== ===========    =========='
    ]
    // sprites added into world with symbols
    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()],
        '$': [sprite('coin')],
        '*': [sprite('surprise-box'), solid(), 'coin-surprise'],
        '%': [sprite('surprise-box'), solid(), 'shroom-surprise'],
        '}': [sprite('unboxed'), solid()],
        '(': [sprite('pipe-bottom-left'), solid(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(0.5)],
        '-': [sprite('pipe-top-left'), solid(0.5)],
        '+': [sprite('pipe-top-right'), solid(0.5)],
        '^': [sprite('evil-goomba'), solid()],
        '#': [sprite('shroom'), solid()],

    }
    
    const gameLevel = addLevel(map, levelCfg)
// adds a score in teh top left corner
    const scoreLabel = add([
        text('test'),
        pos(30, 0),
        layer('ui'),
        {
            value: 'test',
        }
    ])

    add([text('level ' + 'test', pos(4, 6))])
    // adds sprite to world and sets position
    const player = add([
        sprite('mario'), solid(),
        pos(30, 0),
        body(),
        origin('bot')
    ])

    // allows keyboard functions

    const MOVE_SPEED = 120
    const JUMP_FORCE = 360

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })
    
    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })
    
    keyPress('space', () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE)
        }
    })

})


start("game")