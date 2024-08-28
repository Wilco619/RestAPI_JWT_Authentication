import { Chart } from "chart.js/auto"
import { useEffect, useRef } from "react";
import "../App.css"

const LineChart = () => {

    const chartRef = useRef(null);
    const chartInstance = useRef(null);


    useEffect(()=>{
        if (chartInstance.current){
            chartInstance.current.destroy();
        }
        const myChartRef = chartRef.current.getContext("2d")

        chartInstance.current = new Chart(myChartRef, {
            type: 'line',
            data: {
              labels: ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'],
              datasets: [{
                label: "Line Chart",
                data: [20,25,24,30,45,120,60,40,70,77,80,100],
                fill:true,
                borderColor:'rgba(0, 159, 189, 0.5)',
                borderWidth:1,
                tension:0.2,
                pointStyle: 'circle',  // This sets the points to be circles
                pointRadius: 4,  // This controls the size of the circles
              }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true, // Show the legend
                        position: 'top', // Position of the legend
                    },
                    title: {
                        display: true, // Show the title
                        text: 'Monthly Data Overview', // Your chart title
                        padding: {
                            top: 5,
                            bottom: 5
                        }
                    }
                },
                scales: {
                  },
            },
        });
        
        return()=>{
            if (chartInstance.current){
                chartInstance.current.destroy();
            }
        } 
    },[])

  return (
    <div className="line-chart">
        <canvas ref={chartRef}/>
    </div>
  )
}

export default LineChart
