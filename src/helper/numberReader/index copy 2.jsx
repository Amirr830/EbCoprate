import React, { useEffect, useState } from 'react';
import _1 from './1.wav'
import _2 from './2.wav'
import _3 from './3.wav'
import _4 from './4.wav'
import _5 from './5.wav'
import _6 from './6.wav'
import _7 from './7.wav'
import _8 from './8.wav'
import _9 from './9.wav'
import _10 from './10.wav'
import _11 from './11.wav'
import _12 from './12.wav'
import _13 from './13.wav'
import _14 from './14.wav'
import _15 from './15.wav'
import _16 from './16.wav'
import _17 from './17.wav'
import _18 from './18.wav'
import _19 from './19.wav'
import _20 from './20.wav'
import _20o from './20_.wav'
import _30 from './30.wav'
import _30o from './30_.wav'
import _40 from './40.wav'
import _40o from './40_.wav'
import _50 from './50.wav'
import _50o from './50_.wav'
import _60 from './60.wav'
import _60o from './60_.wav'
import _70 from './70.wav'
import _70o from './70_.wav'
import _80o from './80_.wav'
import _80 from './80.wav'
import _90 from './90.wav'
import _90o from './90_.wav'
import _100 from './100.wav'
import _100o from './100_.wav'
import _200 from './200.wav'
import _200o from './200_.wav'
import _300 from './300.wav'
import _300o from './300_.wav'
import _400 from './400.wav'
import _400o from './400_.wav'
import _500 from './500.wav'
import _500o from './500_.wav'
import _600 from './600.wav'
import _600o from './600_.wav'
import _700 from './700.wav'
import _700o from './700_.wav'
import _800 from './800.wav'
import _800o from './800_.wav'
import _900 from './900.wav'
import _900o from './900_.wav'
import shomare from './shomare.wav'

var sounds = {
    _1,
    _2,
    _3,
    _4,
    _5,
    _6,
    _7,
    _8,
    _9,
    _10,
    _11,
    _12,
    _13,
    _14,
    _15,
    _16,
    _17,
    _18,
    _19,
    _20,
    _20o,
    _30,
    _30o,
    _40,
    _40o,
    _50,
    _50o,
    _60,
    _60o,
    _70,
    _70o,
    _80o,
    _80,
    _90,
    _90o,
    _100,
    _100o,
    _200,
    _200o,
    _300,
    _300o,
    _400,
    _400o,
    _500,
    _500o,
    _600,
    _600o,
    _700,
    _700o,
    _800,
    _800o,
    _900,
    _900o,
    shomare
}


export default function NumberReader(vTemp) {
    var playList = ['shomare']

    var h = parseInt(vTemp / 1000);
    var s = parseInt((vTemp % 1000) / 100);
    var d = parseInt((vTemp % 100) / 10);
    var y = parseInt((vTemp % 100) % 10);
    if (h > 0 && (s > 0 || d > 0 || y > 0))
        playList.push('_' + h * 1000 + 'o')
    else if (h > 0)
        playList.push('_' + h * 1000)

    if (s > 0 && (d > 0 || y > 0))
        playList.push('_' + s * 100 + 'o')
    else if (s > 0)
        playList.push('_' + s * 100)

    if (d > 0 && y > 0)
        playList.push('_' + d * 10 + 'o')
    else if (d > 0)
        playList.push('_' + d * 10)

    if (y > 0)
        playList.push('_' + y)

    console.log(playList)
    play(playList)

};


const play = (playList) => {
    console.log(playList)
    var audio = new Audio(sounds[playList[0]])
    audio.play()
    audio.addEventListener('ended', () => {
        if (playList.length > 1)
            play(playList.slice(1))
    });
    return () => {
        audio.removeEventListener('ended', () => {
            if (playList.length > 1)
                play(playList.slice(1))
        });
    };
}