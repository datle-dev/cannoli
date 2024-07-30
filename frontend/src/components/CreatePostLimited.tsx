import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Fuse from "fuse.js";

export default function CreatePostLimited() {
  const {
    register: registerWord,
    getValues: getValuesWord,
    resetField: resetFieldWord,
    handleSubmit: handleSubmitWord,
    formState: { errors: errorsWord },
    watch: watchWord,
  } = useForm({ mode: "onChange", defaultValues: { word: "" }})

  const {
    register: registerPost,
    getValues: getValuesPost,
    setValue: setValuePost,
    resetField: resetFieldPost,
    handleSubmit: handleSubmitPost,
    formState: { errors: errorsPost },
    watch: watchPost,
  } = useForm({ mode: "onSubmit", defaultValues: { content: "" }})

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
        .then(res => res.json())
        .then(data => {
          console.log(data);
        })
        .catch((err) => console.log(err));
    },
    onSuccess: () => {
      console.log("create post mutation success");
      resetFieldWord("word")
      resetFieldPost("content")
    },
  });

  const allowedWords = ["hello", "hi", "howdy", "aloha"]
  const [availableWords, setAvailableWords] = useState<string[]>(allowedWords)
  const [usedWords, setUsedWords] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<string[]>([])
  const typedWord = watchWord("word")
  const postLength = watchPost("content").length

  // Using useEffect to monitor typedWord (which is just a
  // react-hook-form watch on the first form's text input)
  // and trigger the fuse.js fuzzy search seems to work best.
  // For some unknown reason, adding an onChange callback
  // to the word's text input field interfered with its validation
  // callback, causing the text in the input to not be recognized
  // until unfocusing and refocusing on said input
  useEffect(() => {
    const fuse = new Fuse(allowedWords)
    if (!typedWord) setSearchResults([])
    setSearchResults(fuse.search(typedWord).map(result => result.item))
  }, [typedWord])

  useEffect(() => {
    setAvailableWords(allowedWords.filter((entry) => {
      return !usedWords.includes(entry)
    }))
  }, [usedWords])
  
  function handleAddWord() {
    console.log('handle add word')
    const word = getValuesWord("word")
    const currentPost = getValuesPost("content")
    console.log(currentPost)
    if (currentPost === "") {
      setValuePost("content", word)
    } else {
      setValuePost("content", currentPost + " " + word)
    }
    setUsedWords([...usedWords, word])
    resetFieldWord("word")
    setSearchResults([])
    document.getElementById("word")?.focus()
  }

  function handleSendPost(data) {
    console.log("handle post post");
    postMutation.mutate(data);
  }

  function handleClearPost() {
    console.log("handle clear post")
    setUsedWords([])
    resetFieldPost("content", { defaultValue: "" })
  }

  function handleDeleteWord() {
    console.log("handle delete word")
    const currentPost = getValuesPost("content")

    if (currentPost === "") return

    const wordArray = currentPost.split(" ")
    wordArray.pop()
    console.log(wordArray)
    setUsedWords(wordArray)
    setValuePost("content", wordArray.join(" "))
  }

  return (
    <>
      <h2>Allowed words:</h2>
      <p>{JSON.stringify(allowedWords)}</p>
      <h2>Available words:</h2>
      <p>{JSON.stringify(availableWords)}</p>
      <h2>Used words:</h2>
      <p>{JSON.stringify(usedWords)}</p>
      <h2>Typed word:</h2>
      <p>{typedWord}</p>
      <form onSubmit={handleSubmitWord(handleAddWord)} autoComplete="off">
        <label htmlFor="word">Add Word</label>
        <input
          type="text"
          id="word"
          {...registerWord("word", {
            required: {
              value: true,
              message: "Word is required",
            },
            validate: {
              isUnused: v => !usedWords.includes(v) || "Word is already used",
              isAvailable: v => availableWords.includes(v) || "Word is not available",
            },
          })}
        />
        <input type="submit" value="Add Word" />
      </form>
      <div style={{display: "flex", gap: "1rem"}}>
        {searchResults.map((result, index) => {
          return (
            <p key={index}>{result}</p>
          )
        })}
      </div>
      {errorsWord.word ? (
        <p>{errorsWord.word.message} X</p>
      ) : (
        <p>Good</p>
      )}

      <form onSubmit={handleSubmitPost(handleSendPost)}>
        <label htmlFor="content">Content</label>
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
        ></textarea>
        <button type="button" onClick={handleClearPost}>Clear</button>
        <button type="button" onClick={handleDeleteWord}>Delete Word</button>
        <input type="submit" value="Post" />
      </form>
      <p>{postLength}/256</p>
      {errorsPost.content && <p>{errorsPost.content.message} X</p>}
    </>
  );
}
