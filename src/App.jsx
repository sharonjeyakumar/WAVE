import { useState, useEffect, useRef } from "react";
// import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
// import Piano from './logic';

function App() {

  

    useEffect(()=>{
        document.addEventListener('contextmenu', (e)=>{
            e.preventDefault();
        });
    })
    
    const instrument = [
        {
            name: 'DefaultGrandPiano',
            soundAddress: 'pianoNotes/',
            imageAddress: 'instrumentsCoverImages/dgp.png',
            bannerAddress: 'instrumentsCoverImages/dgpBanner.png',
            type:'click',
            range: 'C0-C7'
        },
        {
            name: "CremonaViolin",
            soundAddress: 'cremonaViolin/',
            imageAddress: 'instrumentsCoverImages/cvBg.png',
            bannerAddress: 'instrumentsCoverImages/dcvBanner.png',
            type:'holdOn',
            range: 'C3-C4'
        },
        {
            name: "SharonsVoice",
            soundAddress: 'sharonsVoice/',
            imageAddress: 'instrumentsCoverImages/svBg.png',
            bannerAddress: 'instrumentsCoverImages/svBanner.png',
            type:'sing',
            range: 'Gb1-C3'
        },
        {
            name: "PreethisVoice",
            soundAddress: 'preethisVoice/',
            imageAddress: 'instrumentsCoverImages/pvBg.png',
            bannerAddress: 'instrumentsCoverImages/pvBanner.png',
            type:'sing',
            range: 'Gb1-Eb3'
        }
    ]
    const [loadedInstrument, setLoadedInstrument ] = useState(instrument[0]);
    const [curInstrument, setCurInstrument] = useState(loadedInstrument.soundAddress);
    const [curPressMode, setCurPressMode] = useState(loadedInstrument.type);
    const [instrumentImageCover, setInstrumentImageCover] = useState(loadedInstrument.imageAddress);
    const [noOfInstruments, setNoOfInstruments] = useState(3);
    
    useEffect(()=>{
      document.querySelector('.instrumentCover').style.backgroundImage = `url(${instrumentImageCover})`;
    },[]);
    
    const instrumentToDisplay = instrument.slice(0, Math.min(noOfInstruments, instrument.length));

    const handleInstrumentChange = (instrument) =>{
        setLoadedInstrument(instrument);
        setCurInstrument(instrument.soundAddress);
        setCurPressMode(instrument.type);
        setInstrumentImageCover(instrument.imageAddress);

        const ic = document.querySelector('.instrumentCover');
        ic.style.backgroundImage = `url(${instrument.imageAddress})`;
        
    };

    useEffect(() => {
      console.log(curPressMode);

    }, [curPressMode]);
  
    
    
    useEffect(()=>{
      const elements = document.querySelectorAll('.instrumentSelector');

      elements.forEach((ele, index)=>{
        try{
          ele.style.backgroundImage = `url(${instrument[index].bannerAddress})`;
        }catch{

        }
      })
    }, []);

    const handleInstrumentSelection = (e)=>{
      const element = e.target;
      const elements = document.querySelectorAll('.instrumentSelector');
      elements.forEach((ele, index)=>{
        try{
          if(ele== element){
            setLoadedInstrument(instrument[index]);
            console.log(index)
          }
          
        }catch{

        }
      })
      
      
    }

    


    const handleMouseDown = (e) => {
      const element = e.target;
      e.preventDefault();

      if(element.classList.contains('pianoWhiteKey')){
        element.classList.add('pressedWhite');
        element.classList.remove('mouseUpWhite');
      } else if (element.classList.contains('pianoBlackKey')){
        element.classList.add('pressedBlack');
        element.classList.remove('mouseUpBlack');
      }

      
      
      const note = element.innerText.trim();
      console.log(note);
      
      const audioAddress = `${curInstrument}${note}.mp3`

      const curNote = new Audio(audioAddress);
      curNote.currentTime = 0;
      curNote.play();
      
      if(curPressMode =='holdOn'){
        curNote.loop = true;
      }

      element.addEventListener('mouseup', ()=>{
  
        if (curPressMode == 'holdOn') {
          setTimeout(()=>{
            curNote.pause(); 
            curNote.currentTime = 0;
            console.log("mouse is lifeted")
          },0)
      }
        if(curPressMode =='sing'){
          setTimeout(()=>{
            curNote.currentTime = 0;
            curNote.pause(); 
          },200)
        }
      })

      element.addEventListener('mouseleave', ()=>{
        if (curPressMode == 'holdOn') {
          setTimeout(()=>{
            curNote.pause(); 
            console.log("mouse is lifeted")
          },0)
      }
        if(curPressMode =='sing'){
          setTimeout(()=>{
            curNote.pause(); 
          },200)
        }
      })



    };

    const handleMouseUp = (e) =>{
      const element = e.target;
      try{
        if(element.classList.contains('pianoWhiteKey')){
          element.classList.remove('pressedWhite');
          element.classList.add('mouseUpWhite');
        } else if (element.classList.contains('pianoBlackKey')){
          element.classList.remove('pressedBlack');
          element.classList.add('mouseUpBlack');
        }
      }catch{
        
      }
    }
    

    const handleMouseLeave = (e)=>{
      const element = e.target;
      try{
        element.style.cursor = 'default';
        if(element.classList.contains('pianoWhiteKey')){
          element.classList.remove('pressedWhite');
          element.classList.add('mouseUpWhite');
        } else if (element.classList.contains('pianoBlackKey')){
          element.classList.remove('pressedBlack');
          element.classList.add('mouseUpBlack');
        }
      }catch{

      }
    }

    const keyFlags = useRef({}); 
  const audioRefs = useRef({}); 

  const noteMap = {
    'z': 'C2', 'x': 'D2', 'c': 'E2', 'v': 'F2', 'b': 'G2', 'n': 'A2', 'm': 'B2', 
    ',': 'C3', '.': 'D3', '/': 'E3', 'q': 'C3', 'w': 'D3', 'e': 'E3', 'r': 'F3', 
    't': 'G3', 'y': 'A3', 'u': 'B3', 'i': 'C4', 'o': 'D4', 'p': 'E4', '[': 'F4', 
    ']': 'G4', 's': 'Db2', 'd': 'Eb2', 'g': 'Gb2', 'h': 'Ab2', 'j': 'Bb2', 
    'l': 'Db3', ';': 'Eb3', '2': 'Db3', '3': 'Eb3', '5': 'Gb3', '6': 'Ab3', 
    '7': 'Bb3', '9': 'Db4', '0': 'Eb4', '=': 'Gb4'
  };

  const handleKeyDown = (event) => {
    const key = event.key;
    if (keyFlags.current[key] || !noteMap[key]) return;

    keyFlags.current[key] = true;

    const note = noteMap[key];
    const audioAddress = `${curInstrument}${note}.mp3`;

    const curNote = new Audio(audioAddress);
    curNote.currentTime = 0;
    curNote.play();

    if (curPressMode === 'holdOn') {
      curNote.loop = true;
    }

    audioRefs.current[key] = curNote;
  };

  const handleKeyUp = (event) => {
    const key = event.key;
    if (!noteMap[key]) return;

    keyFlags.current[key] = false;

    const curNote = audioRefs.current[key];
    if (curNote) {
      if (curPressMode === 'holdOn') {
        curNote.loop = false;
        curNote.pause();
      } else if (curPressMode === 'sing') {
        setTimeout(() => curNote.pause(), 200);
      }
      delete audioRefs.current[key];
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [curInstrument, curPressMode]);

 
  
 
  return (

    <div className="App">
     
   

    <main>
      <div className="page">
    <div className="leftCol">
      {instrumentToDisplay.map((instrument, index)=>{
        return(
          <div key={index} className="instrumentSelector" onClick={() => {
            handleInstrumentSelection(instrument, index);
            handleInstrumentChange(instrument);
          }}></div>
        );
      })

      }








      { <div className="emptySpace"></div> }
    </div>
    <div className="rightCol">
      <div className="instrumentCover">

      </div>

      <div className="aboveMargin">

      </div>

      <div className="pianoFrame">
        <div className="rangeOfInstrument">C0-C7</div>
        <div className="frameWrapper">
          <div className="octaveWrapper">
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Db1</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Eb1</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Gb1</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Ab1</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Bb1</div>
            <div id="o1" className="pianoWhiteKey firstBatch firstWhiteKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>C1</div>
            <div className="pianoWhiteKey firstBatch"  onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>D1</div>
            <div className="pianoWhiteKey firstBatch"  onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>E1</div>
            <div className="pianoWhiteKey firstBatch"  onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>F1</div>
            <div className="pianoWhiteKey secondBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>G1</div>
            <div className="pianoWhiteKey secondBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>A1</div>
            <div className="pianoWhiteKey firstBatch"  onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>B1</div>
          </div>
          
          <div className="octaveWrapper">
            <div id="o2" className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}         onKeyDown={handleKeyDown}   onKeyUp={handleKeyUp}>C2</div>
            <div className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}                   onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>D2</div>
            <div className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}                   onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>E2</div>
            <div className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>F2</div>
            <div className="pianoWhiteKey secondBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>G2</div>
            <div className="pianoWhiteKey secondBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>A2</div>
            <div className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>B2</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>Db2</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>Eb2</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>Gb2</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>Ab2</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>Bb2</div>
          </div>
          
          <div className="octaveWrapper">
            <div id="o3" className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown}>C3</div>
            <div className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown}>D3</div>
            <div className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown}>E3</div>
            <div className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown}>F3</div>
            <div className="pianoWhiteKey secondBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown}>G3</div>
            <div className="pianoWhiteKey secondBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown}>A3</div>
            <div className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown}>B3</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown}>Db3</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown}>Eb3</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onKeyDown={handleKeyDown}>Gb3</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Ab3</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Bb3</div>
          </div>
          
          <div className="octaveWrapper">
            <div id="o4" className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>C4</div>
            <div className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>D4</div>
            <div className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>E4</div>
            <div className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>F4</div>
            <div className="pianoWhiteKey secondBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} >G4</div>
            <div className="pianoWhiteKey secondBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>A4</div>
            <div className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>B4</div>
            <div className="pianoBlackKey" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Db4</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Eb4</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Gb4</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Ab4</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Bb4</div>
          </div>
          
          <div className="octaveWrapper">
            <div id="o5" className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>C5</div>
            <div className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>D5</div>
            <div className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>E5</div>
            <div className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>F5</div>
            <div className="pianoWhiteKey secondBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>G5</div>
            <div className="pianoWhiteKey secondBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>A5</div>
            <div className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>B5</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Db5</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Eb5</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Gb5</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Ab5</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Bb5</div>
          </div>
          
          <div className="octaveWrapper">
            <div id="o6" className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>C6</div>
            <div className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>D6</div>
            <div className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>E6</div>
            <div className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>F6</div>
            <div className="pianoWhiteKey secondBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>G6</div>
            <div className="pianoWhiteKey secondBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>A6</div>
            <div className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>B6</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Db6</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Eb6</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Gb6</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Ab6</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Bb6</div>
          </div>
          
          <div className="octaveWrapper">
            <div id="o7" className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>C7</div>
            <div className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}> D7</div>
            <div className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>E7</div>
            <div className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>F7</div>
            <div className="pianoWhiteKey secondBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} >G7</div>
            <div className="pianoWhiteKey secondBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>A7</div>
            <div className="pianoWhiteKey firstBatch"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>B7</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Db7</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Eb7</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Gb7</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Ab7</div>
            <div className="pianoBlackKey"onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>Bb7</div>
          </div>
          <div className="octaveWrapper">
            <div id="o8" className="pianoWhiteKey firstBatch" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>C8</div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
    </main>
    </div>
  );
}

export default App;
