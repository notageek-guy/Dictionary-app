import React, { useState, useEffect, Fragment } from "react";
import {
  Stack,
  Typography,
  Box,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
  Button,
  styled,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";
import notFound from '../../assets/error.jpg';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const AlignCenterBox = styled(Box)(({ theme }) => ({
  ...theme.mixins.alignInTheCenter,
}));

export default function Definition({
    bookmarks,
    addBookmark,
    removeBookmark
}) {
  const { word } = useParams();
  const goBack = useNavigate();
  const [def, setDef] = useState([]);
  const [exist, setExist] = useState(true);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isBookmarked = Object.keys(bookmarks).includes(word);
  const updateState = data => {
    setDef(data)
    const phonetics = data[0].phonetics
    if (!phonetics.length) return;
    const url = phonetics[0].audio.replace('//ssl', 'https://ssl');
    setAudio(new Audio(url));
}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        updateState(resp.data)
        setLoading(false);
      } catch (err) {
        setExist(false);
      }
    };
    fetchData();
  }, []);
  console.log(def);
  if (!exist)
    return (
      <AlignCenterBox>
        <img src={notFound} alt="404" style={{
            maxWidth:"400px",
            height:"auto",
            objectFit:"cover",
            border:"none",
            outline:"none",
            borderRadius:"10%",
            padding:0,
            margin:0
        }} />
        <Typography sx={{my:2}} >Word not found</Typography>
        <Button
          variant="contained"
          size="medium"
          sx={{ textTransform: "capitalize", mt: 2 }}
          onClick={() => goBack(-1)}
        >
          Go back
        </Button>
      </AlignCenterBox>
    );
  if (loading)
    return (
      <AlignCenterBox>
        <CircularProgress />
      </AlignCenterBox>
    );
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <IconButton onClick={() => goBack(-1)}>
          <BackIcon color='black' />
        </IconButton>
        <IconButton onClick={() => isBookmarked ? removeBookmark(word) : addBookmark(word, def)}>
                    {isBookmarked ? <BookmarkedIcon sx={{ color: 'black' }} /> : <BookmarkIcon sx={{ color: 'black' }} />}
                </IconButton>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          mt: 3,
          background:
            "linear-gradient(90.17deg, #191E5D 0.14%, #0F133A 98.58%)",
          boxShadow: "0px 10px 20px rgba(19, 23, 71, 0.25)",
          px: 4,
          py: 5,
          color: "white",
          borderRadius: 2,
        }}
      >
      <Typography sx={{ textTransform: 'capitalize' }} variant="h5">{word}</Typography>
                {audio && <IconButton onClick={() => audio.play()} sx={{
                    borderRadius: 2,
                    p: 1,
                    color: '#fff',
                    background: theme => theme.palette.pink,
                }} ><PlayIcon /></IconButton>}
      </Stack>

      {def?.map((def, idx) => (
        <Fragment key={idx}>
          <Divider sx={{ display: idx === 0 ? "none" : "block", my: 3 }} />
          {def.meanings.map((meaning) => (
            <Box
              key={Math.random()}
              sx={{
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.05)",
                backgroundColor: "#fff",
                p: 2,
                borderRadius: 2,
                mt: 3,
              }}
            >
              <Typography
                sx={{ textTransform: "capitalize" }}
                color="GrayText"
                variant="subtitle1"
              >
                {meaning.partOfSpeech}
              </Typography>
              {meaning.definitions.map((definition, idx) => (
                <Typography
                  sx={{ my: 1 }}
                  variant="body2"
                  color="GrayText"
                  key={definition.definition}
                >
                  {meaning.definitions.length > 1 && `${idx + 1}. `}{" "}
                  {definition.definition}
                </Typography>
              ))}
            </Box>
          ))}
        </Fragment>
      ))}
    </>
  );
}
