import { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Grid } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./themes/theme";
import React from "react";
import Home from "./components/home";
import Bookmarks from "./components/bookmark";
import Definition from "./components/definition";

export default function App() {
  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem("bookmarks")) || {}
  );

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (word, definitions) =>
    setBookmarks((oldBookmarks) => ({
      ...oldBookmarks,
      [word]: definitions,
    }));

  const removeBookmark = (word) =>
    setBookmarks((oldBookmarks) => {
      const temp = { ...oldBookmarks };
      delete temp[word];
      return temp;
    });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container justifyContent={'center'}>
        <Grid item xs={12} sx={{ p: 2 }}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/bookmarks"
                element={<Bookmarks bookmarks={bookmarks} />}
              />
              <Route
                path="/search/:word"
                element={
                  <Definition
                    bookmarks={bookmarks}
                    addBookmark={addBookmark}
                    removeBookmark={removeBookmark}
                  />
                }
              />
            </Routes>
          </Router>
         
        </Grid>
       
      </Grid>
    </ThemeProvider>
  );
}
