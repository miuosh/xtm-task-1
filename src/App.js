import React, { useState, useEffect } from "react";
import "./styles.css";
import useDebounce from "./useDebounce";
import axios from "axios";
import RenderHTML from "./RenderHtml";

export default function App() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [result, setResult] = useState([]);

  const makeApiCall = async () => {
    const url = `https://en.wikipedia.org/w/api.php?&origin=*&action=query&list=search&format=json&srsearch=%22${searchPhrase}%22&srlimit=10`;

    try {
      console.log("make api call");
      const response = await axios(url, {
        method: "GET",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" }
      });
      if (response.data.query) setResult(response.data.query.search);
    } catch (error) {
      console.error(error);
    }
  };

  const makeDebouncedApiCall = useDebounce(makeApiCall);

  const handleSearchChange = ({ target }) => {
    setSearchPhrase(target.value);
  };

  const handleReplaceTermChange = ({ target }) => {
    setReplaceTerm(target.value);
  };

  const handleReplace = () => {
    const re = new RegExp(searchPhrase, "i");
    const index = result.findIndex((item) => re.test(item.snippet));

    if (index >= 0) {
      const newResult = result.map((item, i) => {
        if (i === index)
          return { ...item, snippet: item.snippet.replace(re, replaceTerm) };
        else return item;
      });
      setResult(newResult);
    }
  };

  const handleReplaceAll = () => {
    const re = new RegExp(searchPhrase, "ig");

    const newResult = result.map((item) => {
      if (re.test(item.snippet)) {
        return { ...item, snippet: item.snippet.replace(re, replaceTerm) };
      } else return item;
    });

    setResult(newResult);
  };

  useEffect(() => {
    if (searchPhrase.length > 0) {
      makeDebouncedApiCall();
    }
  }, [makeDebouncedApiCall, searchPhrase]);

  return (
    <div className="App">
      <section className="search-section">
        <div>
          <input
            id="search-term"
            value={searchPhrase}
            placeholder={"Search phrase..."}
            onChange={handleSearchChange}
          />
          <button onClick={makeApiCall}>Search</button>
        </div>
        <div>
          <input
            id="replace-term"
            value={replaceTerm}
            placeholder={"Replace with..."}
            onChange={handleReplaceTermChange}
          />
          <button onClick={handleReplace} disabled={!replaceTerm.length}>
            Replace
          </button>
          <button onClick={handleReplaceAll} disabled={!replaceTerm.length}>
            Replace All
          </button>
        </div>
      </section>

      <section>
        {result.map((item, i) => {
          return (
            <article key={i}>
              <h3>{item.title}</h3>
              <RenderHTML HTML={item.snippet} />
            </article>
          );
        })}
      </section>
    </div>
  );
}
