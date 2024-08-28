import { Chart } from "chart.js/auto"
import { useEffect, useRef } from "react";
import "../App.css"

const Doughnuts = () => {

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const centerTextPlugin = {
        id: 'centerTextPlugin',
        beforeDraw: (chart) => {
          const { ctx, width, height } = chart;
          ctx.restore();
          const fontSize = (height / 200).toFixed(2);
          ctx.font = `${fontSize}em sans-serif`;
          ctx.textBaseline = 'middle';
    
          const text = '100%';
          const textX = Math.round((width - ctx.measureText(text).width) / 2);
          const textY = height * .56;
    
          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      };
      //873371

    useEffect(()=>{
        if (chartInstance.current){
            chartInstance.current.destroy();
        }
        const myChartRef = chartRef.current.getContext("2d")

        chartInstance.current = new Chart(myChartRef, {
            type: 'doughnut',
            data: {
              labels: ['Work','Pay'],
              datasets: [{
                data: [100, 20],
                backgroundColor: [
                  'rgba(0, 159, 189, 0.5)',
                ],
              }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    centerTextPlugin: centerTextPlugin
                  },
                },
                plugins: [centerTextPlugin],
        });
        
        return()=>{
            if (chartInstance.current){
                chartInstance.current.destroy();
            }
        } 
    },[])

  return (
    <div className="pie-chart">
        <canvas ref={chartRef}/>
    </div>
  )
}

export default Doughnuts
