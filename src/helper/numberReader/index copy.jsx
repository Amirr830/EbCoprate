import React, { useEffect, useState } from 'react';
import _1 from './1.m4a'
import _2 from './2.m4a'
import _3 from './3.m4a'
import _4 from './4.m4a'
import _5 from './5.m4a'
import _6 from './6.m4a'
import _7 from './7.m4a'
import _8 from './8.m4a'
import _9 from './9.m4a'
import _10 from './10.m4a'
import _11 from './11.m4a'
import _12 from './12.m4a'
import _13 from './13.m4a'
import _14 from './14.m4a'
import _15 from './15.m4a'
import _16 from './16.m4a'
import _17 from './17.m4a'
import _18 from './18.m4a'
import _19 from './19.m4a'
import _20 from './20.m4a'
import _20o from './20o.m4a'
import _30 from './30.m4a'
import _30o from './30o.m4a'
import _40 from './40.m4a'
import _40o from './40o.m4a'
import _50 from './50.m4a'
import _50o from './50o.m4a'
import _60 from './60.m4a'
import _60o from './60o.m4a'
import _70 from './70.m4a'
import _70o from './70o.m4a'
import _80o from './80o.m4a'
import _80 from './80.m4a'
import _90 from './90.m4a'
import _90o from './90o.m4a'
import _100 from './100.m4a'
import _100o from './100o.m4a'
import _200 from './200.m4a'
import _200o from './200o.m4a'
import _300 from './300.m4a'
import _300o from './300o.m4a'
import _400 from './400.m4a'
import _400o from './400o.m4a'
import _500 from './500.m4a'
import _500o from './500o.m4a'
import _600 from './600.m4a'
import _600o from './600o.m4a'
import _700 from './700.m4a'
import _700o from './700o.m4a'
import _800 from './800.m4a'
import _800o from './800o.m4a'
import _900 from './900.m4a'
import _900o from './900o.m4a'
import _1000 from './1000.m4a'
import _1000o from './1000o.m4a'

export default function NumberReader({ read }) {
    var playlist = [_1000o]

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [audio] = useState(new Audio(playlist[currentTrackIndex]));
    const [playing, setPlaying] = useState(false);

    const togglePlayPause = () => {
        setPlaying(!playing);
    };

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [playing, audio]);

    useEffect(() => {
        const handleTrackEnd = () => {
            if (currentTrackIndex < playlist.length - 1) {
                setCurrentTrackIndex(currentTrackIndex + 1);
            } else {
                setPlaying(false);
            }
        };

        audio.addEventListener('ended', handleTrackEnd);
        return () => {
            audio.removeEventListener('ended', handleTrackEnd);
        };
    }, [currentTrackIndex, playlist]);

    useEffect(() => {
        audio.src = playlist[currentTrackIndex];
    }, [currentTrackIndex, playlist]);


    useEffect(() => {
        togglePlayPause()
    }, [read])


    return (
        <></>
    );
};

