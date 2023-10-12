import React, { useState, useEffect } from "react";

function CountdownTimer({ handler, times }) {
  const [time, setTime] = useState(times); // Initial time in seconds

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId); // Cleanup timer on component unmount
    } else if (time <= 0) {
      //alert("times Up");
      handler("i", ["timesUp"]);
    } else if (times == 0) {
      setTime(100);
      times = 100;
    }
  }, [time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-300">
      <div className="bg-white rounded-lg p-1 m-1 shadow-lg text-center border border-4 border-slate-200">
        <div className="text-2xl ">
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
