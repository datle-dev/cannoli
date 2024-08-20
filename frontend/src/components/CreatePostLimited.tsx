import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as Form from '@radix-ui/react-form';
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Fuse from "fuse.js";
import { RiInformationLine, RiCheckFill } from "react-icons/ri";
import { Tooltip } from 'react-tooltip'
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
                <RiInformationLine
                  data-tooltip-id="add-word-tooltip"
                />
                <Tooltip id="add-word-tooltip" style={{ zIndex: 99 }}>
                  <div>
                    <p>Type a word here to add it to the post.</p>
                    <p>Only available words can be added.</p>
                    <p>The check mark indicates a valid word.</p>
                  </div>
                </Tooltip>
              </div>
              {typedWord === "" || errorsWord.word ? <></> : <RiCheckFill />}
            </Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                id="word"
                placeholder="Type word here to add"
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
            <Form.Submit className={styles.addWordButton} data-tooltip-id="add-word-button-tooltip" data-tooltip-delay-show={1000}>Add Word</Form.Submit>
            <Tooltip id="add-word-button-tooltip" style={{ zIndex: 99 }}>
              <p>Add word to post if available/valid</p>
            </Tooltip>
          </div>
        </Form.Root>
        <div className={styles.searchResults}>
          {typedWord !== "" ? (
            searchResults.map((result, index) => {
              return <p key={index}>{result}</p>;
            })
          ) : (
            <p className={styles.searchResultPlaceholder}>Begin typing for suggestions</p>
          )}
        </div>
        <Form.Root onSubmit={handleSubmitPost(handleSendPost)}  className={styles.formRootContent}>
          <Form.Field name="content">
            <div className={styles.contentTopRow}>
              <Form.Label className={styles.contentLabel}>
                <h3>Post Content</h3>
                <RiInformationLine
                  data-tooltip-id="content-tooltip"
                />
                <Tooltip id="content-tooltip" style={{ zIndex: 99 }}>
                  <div>
                    <p>Added words appear here.</p>
                    <p>Clear all words or delete words one by one.</p>
                    <p>Click on any word to add it to the post.</p>
                  </div>
                </Tooltip>
              </Form.Label>
              <p>{postLength}/256</p>
            </div>
            <Form.Control asChild>
              <textarea
                id="content"
                readOnly
                defaultValue=""
                placeholder="Added words will appear here. Max of 256 characters."
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
            <button type="button" onClick={handleClearPost} className={styles.clearButton} data-tooltip-id="clear-tooltip" data-tooltip-delay-show={1000}>
              Clear
            </button>
            <Tooltip id="clear-tooltip" style={{ zIndex: 99 }}>
              <p>Clear all words</p>
            </Tooltip>
            <button type="button" onClick={handleDeleteWord} className={styles.deleteWordButton} data-tooltip-id="delete-tooltip" data-tooltip-delay-show={1000}>
              Delete Word
            </button>
            <Tooltip id="delete-tooltip" style={{ zIndex: 99 }}>
              <p>Delete last entered word</p>
            </Tooltip>
            <Form.Submit className={styles.postButton} data-tooltip-id="post-tooltip" data-tooltip-delay-show={1000}>Post</Form.Submit>
            <Tooltip id="post-tooltip" style={{ zIndex: 99 }}>
              <p>Submit post with the above content</p>
            </Tooltip>
          </div>
        </Form.Root>
        {errorsPost.content && <p>{errorsPost.content.message} X</p>}
      </div>
      <div className={styles.createPostLimitedRight}>
        <div className={styles.wordsLabel}>
          <h3>Words</h3>
          <RiInformationLine
            data-tooltip-id="words-tooltip"
          />
          <Tooltip id="words-tooltip" style={{ zIndex: 99 }}>
            <div>
              <p>List of available words.</p>
              <p>Scroll to browse.</p>
              <p>Click on any word to add it to the post.</p>
            </div>
          </Tooltip>
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
