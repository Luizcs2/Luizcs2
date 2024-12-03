// import HighchartsReact from "highcharts-react-official";
// import Highcharts from "highcharts/highmaps";

// function Chart({ series, name, index }) {

//     const seriesData = [{
//         name,
//         data: series,
//       }
//     ]

//     console.log('inxed', series, index);
//   return (
//     <div className="charts-container center">
//       <div className="chart" key={index}>
//           <HighchartsReact
//             highcharts={Highcharts}
//             options={{
//               series: seriesData
//             }}
//           />
//         </div>
//     </div>
//   );
// }

// export default Chart;

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";

function Chart({ series, name, index, chartType }) {
  const chartOptions = {
    chart: {
      type: chartType,
    },
    title: {
      text: name,
    },
    series: [
      {
        name,
        data: series,
      },
    ],
  };

  return (
    <div className="charts-container center">
      <div className="chart" key={index}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
}

export default Chart;
