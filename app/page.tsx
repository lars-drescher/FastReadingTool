"use client";
"use strict";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [text, setText] = React.useState(
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
  );
  const [wordArray, setWordArray] = React.useState<Array<string>>([]);
  const [timeToRead, setTimeToRead] = React.useState(0);
  const [wpm, setWpm] = React.useState<number | null>(350);

  React.useEffect(() => {
    let timePerWord = 0;
    if (wpm !== null) timePerWord = 60 / wpm;
    setWordArray(text.split(" "));
    setTimeToRead(Math.round(timePerWord * text.split(" ").length));
  }, [text, wpm]);

  return (
    <main className="flex items-center justify-center h-screen overflow-hidden p-4">
      <div className="p-8 max-w-[600px] w-full">
        <div className="flex">
          <h1 className="text-xl mb-4 grow">Fast Reading Tool</h1>
          <span className="text-xl">{timeToRead} Seconds</span>
        </div>

        <Textarea
          placeholder="Text goes here..."
          value={text}
          onChange={(input) => {
            setText(input.target.value);
          }}
          spellCheck={false}
          maxLength={100000}
          className="mb-4 h-64"
        />

        <div className="flex gap-2 relative">
          <Input
            type="number"
            value={wpm as number}
            onChange={(event) => {
              setWpm(Number(event.target.value));
              if (event.target.value === "" || event.target.value === "0")
                setWpm(null);
              if (Number(event.target.value) > 999) setWpm(999);
            }}
            placeholder="words per minute"
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute right-0 mr-24 mt-2 select-none">wpm</span>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={wpm === null ? true : false}>
                Start
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-[600px] h-full sm:h-auto">
              <StartReader wordArray={wordArray} wpm={wpm as number} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}

function StartReader({
  wordArray,
  wpm,
}: {
  wordArray: Array<string>;
  wpm: number;
}) {
  const [progress, setProgress] = React.useState(0);
  const [startReader, setStartReader] = React.useState(false);

  return (
    <>
      <DialogHeader>
        <Progress className="mt-4" value={progress} />
      </DialogHeader>
      <p className="text-center my-16 text-4xl">
        {startReader ? (
          <TextReader
            wordArray={wordArray}
            wpm={wpm}
            setProgress={setProgress}
          />
        ) : (
          <Timer setStartReader={setStartReader} />
        )}
      </p>
    </>
  );
}

function TextReader({
  wordArray,
  wpm,
  setProgress,
}: {
  wordArray: Array<string>;
  wpm: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [currentWord, setCurrentWord] = React.useState("");
  const delay = (60 / wpm) * 1000;
  const totalWords = wordArray.length;

  React.useEffect(() => {
    setCurrentWord(wordArray[currentWordIndex]);
    setProgress(Math.round(((currentWordIndex + 1) / totalWords) * 100));

    if (currentWordIndex < wordArray.length - 1) {
      setTimeout(() => {
        setCurrentWordIndex(currentWordIndex + 1);
      }, delay);
    } else {
      setCurrentWord("Finished");
    }
  }, [currentWordIndex]);

  return <>{currentWord}</>;
}

function Timer({
  setStartReader,
}: {
  setStartReader: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [time, setTime] = React.useState(3);

  React.useEffect(() => {
    if (time !== 0) {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else {
      setTimeout(() => {
        setStartReader(true);
      }, 500);
    }
  }, [time]);

  return <>{time}</>;
}
