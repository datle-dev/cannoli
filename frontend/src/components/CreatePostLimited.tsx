import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as Form from '@radix-ui/react-form';
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Fuse from "fuse.js";
import { RiInformationLine, RiCheckFill, RiCloseLine } from "react-icons/ri";
import styles from "./CreatePostLimited.module.css";

export default function CreatePostLimited({ onSuccessSetDialogOpen }) {
  const {
    register: registerWord,
    getValues: getValuesWord,
    resetField: resetFieldWord,
    handleSubmit: handleSubmitWord,
    formState: { errors: errorsWord },
    watch: watchWord,
  } = useForm({ mode: "onChange", defaultValues: { word: "" } });

  const {
    register: registerPost,
    getValues: getValuesPost,
    setValue: setValuePost,
    resetField: resetFieldPost,
    handleSubmit: handleSubmitPost,
    formState: { errors: errorsPost },
    watch: watchPost,
  } = useForm({ mode: "onSubmit", defaultValues: { content: "" } });

  const postMutation = useMutation({
    mutationFn: async (data) => {
      console.log("create post mutationFn fired");
      return await fetch("http://127.0.0.1:8000/posts/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log(err));
    },
    onSuccess: () => {
      console.log("create post mutation success");
      resetFieldWord("word");
      resetFieldPost("content");
      onSuccessSetDialogOpen(false);
    },
  });

  const allowedWords = [
    "hello",
    "hi",
    "howdy",
    "aloha",
    "I",
    "he",
    "she",
    "it",
    "the",
    "a",
    "which",
    "what",
    "how",
    "very",
    "really",
    "today",
    "yesterday",
    "tomorrow",
    "from",
    "until",
    "thus",
    "verily",
    "upon",
  ];
  const [availableWords, setAvailableWords] = useState<string[]>(allowedWords);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const typedWord = watchWord("word");
  const postLength = watchPost("content").length;

  // Using useEffect to monitor typedWord (which is just a
  // react-hook-form watch on the first form's text input)
  // and trigger the fuse.js fuzzy search seems to work best.
  // For some unknown reason, adding an onChange callback
  // to the word's text input field interfered with its validation
  // callback, causing the text in the input to not be recognized
  // until unfocusing and refocusing on said input
  useEffect(() => {
    const fuse = new Fuse(allowedWords);
    if (!typedWord) setSearchResults([]);
    setSearchResults(fuse.search(typedWord).map((result) => result.item));
  }, [typedWord]);

  useEffect(() => {
    setAvailableWords(
      allowedWords.filter((entry) => {
        return !usedWords.includes(entry);
      })
    );
  }, [usedWords]);

  function handleAddWord() {
    console.log("handle add word");
    const word = getValuesWord("word");
    const currentPost = getValuesPost("content");
    console.log(currentPost);
    if (currentPost === "") {
      setValuePost("content", word);
    } else {
      setValuePost("content", currentPost + " " + word);
    }
    setUsedWords([...usedWords, word]);
    resetFieldWord("word");
    setSearchResults([]);
    document.getElementById("word")?.focus();
  }

  function handleSendPost(data) {
    console.log("handle post post");
    postMutation.mutate(data);
  }

  function handleClearPost() {
    console.log("handle clear post");
    setUsedWords([]);
    resetFieldPost("content", { defaultValue: "" });
  }

  function handleDeleteWord() {
    console.log("handle delete word");
    const currentPost = getValuesPost("content");

    if (currentPost === "") return;

    const wordArray = currentPost.split(" ");
    wordArray.pop();
    console.log(wordArray);
    setUsedWords(wordArray);
    setValuePost("content", wordArray.join(" "));
  }

  function handleWordClick(e) {
    console.log("handle word click")
    // console.log(e.currentTarget.innerText)
    const word = e.currentTarget.innerText;
    const currentPost = getValuesPost("content");
    console.log(currentPost);
    if (currentPost === "") {
      setValuePost("content", word);
    } else {
      setValuePost("content", currentPost + " " + word);
    }
    setUsedWords([...usedWords, word]);
    resetFieldWord("word");
    setSearchResults([]);
    document.getElementById("word")?.focus();
  }

  return (
    <div className={styles.createPostLimited}>
      <div className={styles.createPostLimitedLeft}>
        <Form.Root onSubmit={handleSubmitWord(handleAddWord)} autoComplete="off" className={styles.formRootAddWord}>
          <Form.Field name="word">
            <Form.Label className={styles.addWordLabel}>
              <div className={styles.addWordLabelLeft}>
                <h3>Add Word</h3>
                <RiInformationLine />
              </div>
              {errorsWord.word ? <></> : <RiCheckFill />}
            </Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                id="word"
                {...registerWord("word", {
                  required: {
                    value: true,
                    message: "Word is required",
                  },
                  validate: {
                    isUnused: (v) =>
                      !usedWords.includes(v) || "Word is already used",
                    isAvailable: (v) =>
                      availableWords.includes(v) || "Word is not available",
                  },
                })}
                className={styles.addWordInput}
              />
            </Form.Control>
          </Form.Field>
          <div className={styles.addWordButtonRow}>
            <Form.Submit className={styles.addWordButton}>Add Word</Form.Submit>
          </div>
        </Form.Root>
        <div className={styles.searchResults}>
          {searchResults.map((result, index) => {
            return <p key={index}>{result}</p>;
          })}
        </div>
        <Form.Root onSubmit={handleSubmitPost(handleSendPost)}  className={styles.formRootContent}>
          <Form.Field name="content">
            <div className={styles.contentTopRow}>
              <Form.Label className={styles.contentLabel}>
                <h3>Content</h3>
                <RiInformationLine />
              </Form.Label>
              <p>{postLength}/256</p>
            </div>
            <Form.Control asChild>
              <textarea
                id="content"
                readOnly
                defaultValue=""
                {...registerPost("content", {
                  required: {
                    value: true,
                    message: "Words are required",
                  },
                  maxLength: {
                    value: 256,
                    message: "Max of 256 characters",
                  },
                })}
                className={styles.contentTextArea}
              />
            </Form.Control>
            <Form.Message asChild className={styles.formError}>
              <p>{errorsPost.content?.message}</p>
            </Form.Message>
          </Form.Field>
          <div className={styles.contentButtonRow}>
            <button type="button" onClick={handleClearPost} className={styles.clearButton}>
              Clear
            </button>
            <button type="button" onClick={handleDeleteWord} className={styles.deleteWordButton}>
              Delete Word
            </button>
            <Form.Submit className={styles.postButton}>Post</Form.Submit>
          </div>
        </Form.Root>
        {errorsPost.content && <p>{errorsPost.content.message} X</p>}
      </div>
      <div className={styles.createPostLimitedRight}>
        <div className={styles.wordsLabel}>
          <h3>Words</h3>
          <RiInformationLine />
        </div>
        <ScrollArea.Root className={styles.scrollAreaRoot}>
          <ScrollArea.Viewport className={styles.scrollAreaViewport}>
            {availableWords.map((word, index) => {
              return (
                <button type="button" key={index} className={styles.wordButton} onClick={handleWordClick}>
                  {word}
                </button>
              )
            })}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className={styles.scrollAreaScrollbar} orientation="vertical">
            <ScrollArea.Thumb className={styles.scrollAreaThumb} />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </div>
  );
}
