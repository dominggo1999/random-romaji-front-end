import React, { useState, useEffect } from 'react';
import './App.scss';

function App() {
  const url = "https://kana-writing-exercise.herokuapp.com/data";

  const [wordList, setwordList] = useState('');
  const [dataRender, setDataRender] = useState({});
  const [dataReady, setDataReady] = useState(false);
  const [displayDef, setDisplafDef] = useState(false);
  
  // Request wordlist from server 
  const getWordList = async () =>{
    const res = await fetch(url);
    const data = await res.json();

    setwordList(data.data);
    setDataReady(true);
  }

  useEffect(() => {
    setDisplafDef(false);
    getWordList();
  }, [])

  // Pilih satu query random lalu request ke server
  const pickRandom = () =>{
    const randomNumber = Math.floor(Math.random() * wordList.length);

    const word = wordList[randomNumber].word.value;
    console.log(word);

    return getRomaji(word)
  }

  // Request hiragana, romaji, and meaning
  const getRomaji = async (word) =>{
    const res = await fetch("https://kana-writing-exercise.herokuapp.com/data/findromaji",
      {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({"query" : word})
      })

    const result = await res.json();

    setDataRender(result);
    setDisplafDef(false);
  }

  useEffect(() => {
    if(dataReady){
      pickRandom();
      window.addEventListener("keyup",(e)=>{
        if(e.key==="Enter"){
          pickRandom();
        } else if(e.key==='p'){
          setDisplafDef(p=>!p);
        }
      })
    }
  }, [dataReady])

  return (
    <div className="App">
      <div className="container">
        <div className={displayDef?"def display":"def"}>
          <h1>{dataRender.query}</h1>
          <h1>{dataRender.kanji}</h1>
          <h1>{dataRender.hiragana}</h1>
        </div>
        <h1 className="always-displayed">{dataRender.romaji}</h1>
      </div>
    </div>
  );
}

export default App;
