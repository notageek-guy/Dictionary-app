import axios from "axios";
import { useState, useEffect } from "react";

export const useDictionary = (bookmarks,word) => {
  const [definition, setDefinition] = useState([]);
  const [loading,setLoading]=useState(true);
  const [exist, setExist] = useState(true);
  const [audio,setAudio]=useState(null);
    const isBookmarked = Object.keys(bookmarks).includes(word)

  const updateState = data => {
        setDefinition(data)
        const phonetics = data[0].phonetics
        if (!phonetics.length) return;
        const url = phonetics[0].audio.replace('//ssl', 'https://ssl');
        setAudio(new Audio(url));
    }
  useEffect(() => {
    const fetcher = async () => {
      try {
        const resp = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        updateState(resp.data);
      } catch (err) {
        setExist(false);
      }
    };

    if (!isBookmarked) fetcher()
    else updateState(bookmarks[word])

    return {
        audio, 
        definition,
        exist 
    }
  },[]);
};



