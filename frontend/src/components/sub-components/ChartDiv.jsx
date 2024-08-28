import "../App.css"
import Doughnuts from "../Charts/Doughnuts"
import LineChart from "../Charts/LineChart"

const ChartDiv = () => {
  return (
    <div className="chart-div-container">
        <div className="grid-item pie-chart">
            <Doughnuts/>           
        </div>
        <div className="grid-item line-chart">
            <LineChart/>
        </div>
    </div>
  )
}

export default ChartDiv