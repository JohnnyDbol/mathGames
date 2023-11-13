import Head from "next/head";
import { useState, useRef, useEffect } from "react";

const settings = {
  button: "block",
  input: "opacity-0",
  focus: false,
  problem: "1 X 1",
  soultion: 1,
  score: 0,
  lastAnswerTime: 30,

  question: "1 X 1",
};

export default function Home() {
  const [problem, setProblem] = useState("1 X 1");
  const [s, setS] = useState(settings);
  const inputRef = useRef(null);
  const [bord, setBord] = useState("input input-ghost w-20 max-w-xs");
  const [time, setTime] = useState(60); // Initial time in seconds
  const [timing, setTiming] = useState(false);
  const [value, setValue] = useState("1");
  const [counter, setCounter] = useState("text-black text-xl");
  const [go, setGo] = useState("opacity-100");
  const [wrong, setWrong] = useState(0);
  useEffect(() => {
    if (time == 10) {
      setCounter("text-red-600 text-xl");
    }
    if ((time > 0) & timing) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId); // Cleanup timer on component unmount
    } else if (time <= 0) {
      handler("i", ["timesUp"]);
    }
  }, [time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  function generateProblem(v) {
    // Generate two random integers between 2 and 9

    let num1 = 1;
    let num2 = 2;
    if (v == "1") {
      num1 = Math.floor(Math.random() * 8) + 2;
      num2 = Math.floor(Math.random() * 8) + 2;
    } else if (v == "2") {
      num1 = Math.floor(Math.random() * 9) + 11;
      num2 = Math.floor(Math.random() * 8) + 2;
    } else if (v == "3") {
      num1 = Math.floor(Math.random() * 9) + 11;
      num2 = Math.floor(Math.random() * 9) + 11;
    }

    // Formulate the problem and calculate the answer
    const problem = `${num1} X ${num2}`;
    const answer = num1 * num2;

    // Return an object with the problem and answer
    return {
      problem: problem,
      answer: answer,
    };
  }

  function handler(e, opt) {
    if (opt[0] == "updateProblem") {
      const temp = generateProblem(value);

      setProblem(temp.problem);
    } else if (opt[0] == "start") {
      let temp = JSON.parse(JSON.stringify(s));

      temp.focus = true;
      const tempProb = generateProblem(value);
      temp.problem = tempProb.problem;
      temp.solution = tempProb.answer;

      temp.score = 0;
      inputRef.current.focus();
      setTiming(true);
      setGo("opacity-0");
      setS(temp);
      if (value == 1) {
        setTime(30);
      } else if (value == 2) {
        setTime(45);
      } else if (value == 3) {
        setTime(60);
      }
    } else if (opt[0] == "numChange") {
      let temp = JSON.parse(JSON.stringify(s));
      const a = temp.solution;
      const i = e.target.value / 1;

      if (a + "".length < i + "".length) {
        e.target.value = "";
        setWrong(wrong + 1);
        doThings(false);
      } else if (((a + "").length == (i + "").length) & (a != i)) {
        e.target.value = "";
        setWrong(wrong + 1);
        doThings(false);
      } else if (a == i) {
        e.target.value = "";

        const tempProb = generateProblem(value);
        temp.problem = tempProb.problem;
        temp.solution = tempProb.answer;
        temp.score = temp.score + 1;
        doThings(true);
        setS(temp);
      }
    } else if (opt[0] == "timesUp") {
      document.getElementById("my_modal_1").showModal();
      setCounter("text-black text-xl");
      setTiming(false);
    } else if (opt[0] == "difficulty") {
      setValue(e.target.value);
    }
  }
  function doThings(w) {
    const warn = "input input-error w-20 max-w-xs";
    const sucs = "input input-success w-20 max-w-xs";
    const norm = "input input-ghost w-20 max-w-xs";
    let tBord = "";
    // Define the two functions
    function thing1() {
      if (w) {
        tBord = sucs;
      } else {
        tBord = warn;
      }
      setBord(tBord);
    }

    function thing2() {
      setBord(norm);
    }

    // Execute thing1 immediately
    thing1();

    // Schedule thing2 to be executed 1 second later
    setTimeout(thing2, 1000);
  }

  return (
    <>
      <div data-theme="cyberpunk">
        <div className="flex  justify-center bg-slate-200">
          <div className="w-50">
            <div className="navbar bg-base-100 ">
              <div className="navbar-start">
                <a className="border border-4 px-3 py-6 rounded-sm bg-primary text-3xl font-bold ">
                  Math
                </a>
              </div>

              <div className="navbar-end">
                <div className="stats shadow bg-secondary border border-4">
                  <div className="stat p-3">
                    <div className="stat-title">score</div>
                    <div className="stat-value">{s.score}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-4">
              <div className="flex flex-col items-center justify-center bg-neutral-600">
                <div className="bg-white rounded-lg p-1 m-1 shadow-lg text-center border border-4 border-slate-200">
                  <div className={counter}>
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center pt-1 pb-4 ">
              <div className="card w-200 bg-base-100 shadow-xl p-7 ">
                <div className="card-body items-center text-center">
                  <h2 className="card-title text-3xl font-bold">{s.problem}</h2>
                  <div>
                    <div>
                      <input
                        type="text"
                        placeholder=""
                        className={bord}
                        ref={inputRef}
                        onChange={(e) => handler(e, ["numChange"])}
                      />
                    </div>
                  </div>
                  <div className={go + " join"}>
                    <div className={s.button + "join-item px-1 "}>
                      <div
                        className="btn btn-accent"
                        onClick={(e) => handler(e, ["start"])}
                      >
                        Go!
                      </div>
                    </div>
                    <div className={s.button + "join-item px-1"}>
                      <select
                        onChange={(e) => handler(e, ["difficulty"])}
                        value={value}
                        className="select select-bordered select-accent w-full max-w-xs"
                      >
                        <option value="1">Easy</option>
                        <option value="2">Medium</option>
                        <option value="3">Hard</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Game Over</h3>
            <p className="py-4">Your score = {s.score}</p>
            <p className="py-4">Number wrong = {wrong}</p>
            <p className="py-4">Next game:</p>
            <div className={s.button + "join-item px-1"}>
              <select
                onChange={(e) => handler(e, ["difficulty"])}
                value={value}
                className="select select-bordered select-accent w-full max-w-xs"
              >
                <option value="1">Easy</option>
                <option value="2">Medium</option>
                <option value="3">Hard</option>
              </select>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn" onClick={(e) => handler(e, ["start"])}>
                  Play Again?
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
}
