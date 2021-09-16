import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale";

const Graph = (props) => {
  const [rawData, setRawData] = useState([]);
  useEffect(() => {
    fetch("/api/v1/projects/1/comments")
      .then((res) => res.json())
      .then((data) => {
        setRawData(data);
      });
  }, []);
  const datasets = rawData.map((keyword) => {
    let random_rgba = () => {
      var o = Math.round, r = Math.random, s = 255;
      return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ', 0.9)';
  }
    return {
      label: keyword.searchTerm,
      borderColor: random_rgba(),
      cubicInterpolationMode: 'monotone',
      tension: 0.5,
      data: keyword.Comments.map((comment) => {
        const commentData = JSON.parse(comment.data);
        const sentimentData = JSON.parse(comment.sentiment);
        return {
          x: commentData.created_utc * 1000,
          y: sentimentData.score,
        };
      })
      .sort((a, b) => a.x > b.x ? -1 : 1),
    };
  });
  console.log(datasets)
  if (datasets.length === 0) {
    return ''
  }
  return (
    <div>
      <Line
        data={{
          datasets
        }}
        height={400}
        width={600}
        options={{
          maintainAspectRatio: false,
          adapters: {
            date: {
              locale: enUS,
            },
          },
          ticks: {
            source: 'auto'
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "minute",
              }
            },
          },
        }}
      />
    </div>
  );
};
export default Graph;
