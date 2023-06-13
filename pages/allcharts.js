import { useEffect } from "react"
import { Chart } from "chart.js";

import styles from '../styles.module.css'


export async function getStaticProps() {

  const wrapper_host = process.env.WRAPPER_HOST
  const wrapper_port = process.env.WRAPPER_PORT
//  const wrapper_metric = process.env.WRAPPER_METRIC
  const wrapper_url = "http://" + wrapper_host + ":" + wrapper_port + "/" 
  console.log(wrapper_url)


  //const res = await fetch('https://api.github.com/repos/developit/preact')
  //const response  = await fetch('ec2-3-8-157-149.eu-west-2.compute.amazonaws.com:3000/motraffic')
  //const mo_resp  = await fetch('http://ec2-3-8-157-149.eu-west-2.compute.amazonaws.com:3000/motraffic')
  const mo_resp  = await fetch(wrapper_url+"motraffic")
  const mo_json = await mo_resp.json()
  const mt_resp  = await fetch(wrapper_url+"mttraffic")
  const mt_json = await mt_resp.json()
  const cpuusage_resp  = await fetch(wrapper_url+"cpuusage")
  const cpuusage_json = await cpuusage_resp.json()
  const cputemp_resp  = await fetch(wrapper_url+"cputemp")
  const cputemp_json = await cputemp_resp.json()
  const memusage_resp  = await fetch(wrapper_url+"memusage")
  const memusage_json = await memusage_resp.json()
  const diskusage_resp  = await fetch(wrapper_url+"diskusage")
  const diskusage_json = await diskusage_resp.json()
//  console.log("IS OK")
//  console.log(mo_resp.ok)
//  console.log(mo_json)
//  console.log(mt_json)
  console.log(cputemp_json)
//  console.log("AFTER2")

  return {
    props: {
      //stars: json.stargazers_count,
      mo_json,
      mt_json,
      cpuusage_json,
      cputemp_json,
      memusage_json,
      diskusage_json
    },
  }
}


function Example({mo_json, mt_json, cpuusage_json, cputemp_json, memusage_json, diskusage_json}) {


  useEffect(() => {

    var mo_ctx = document.getElementById('moChart').getContext('2d');
    var mt_ctx = document.getElementById('mtChart').getContext('2d');
    var cpuu_ctx = document.getElementById('cpuuChart').getContext('2d');
    var cput_ctx = document.getElementById('cputChart').getContext('2d');
    var mem_ctx = document.getElementById('memChart').getContext('2d');
    var disk_ctx = document.getElementById('diskChart').getContext('2d');
    var moChart = new Chart(mo_ctx, {
      type: 'line',
      data: {
        labels: mo_json.timestamps,
        datasets: [{
          //data: [86, 114, 106, 106, 107, 111, 133],
          data: mo_json.data,
          label: "MO",
          borderColor: "#3e95cd",
          backgroundColor: "#7bb6dd",
          fill: true,
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  var mtChart = new Chart(mt_ctx, {
    type: 'line',
    data: {
      //labels: ["Tunday", "Tonday", "Tuesday", "Tednesday", "Thursday", "Triday", "Taturday"],
      labels: mt_json.timestamps,
      datasets: [{
        //data: [86, 114, 106, 106, 107, 111, 133],
        data: mt_json.data,
        label: "MT",
        borderColor: "#3e95cd",
        backgroundColor: "#7bb6dd",
        fill: false,
      }
      ]
    },
      options: {
	//responsive means the chart is resized when the window is
        responsive: true,
        maintainAspectRatio: false,
//        layout: {
//          padding: {
//            top: 5,
//            left: 35,
//            right: 35,
//            bottom: 15
//          }
//	}
      }
  });
    var cpuuChart = new Chart(cpuu_ctx, {
      type: 'line',
      data: {
        labels: cpuusage_json.timestamps,
        datasets: [{
          //data: [86, 114, 106, 106, 107, 111, 133],
          data: cpuusage_json.data,
          label: "%",
          borderColor: "#3e95cd",
          backgroundColor: "#7bb6dd",
          fill: true,
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
    var cputChart = new Chart(cput_ctx, {
      type: 'line',
      data: {
        labels: cputemp_json.timestamps,
        datasets: [{
          //data: [86, 114, 106, 106, 107, 111, 133],
          data: cputemp_json.data,
          label: "oC",
          borderColor: "#3e95cd",
          backgroundColor: "#7bb6dd",
          fill: true,
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
    var memChart = new Chart(mem_ctx, {
      type: 'line',
      data: {
        labels: memusage_json.timestamps,
        datasets: [{
          //data: [86, 114, 106, 106, 107, 111, 133],
          data: memusage_json.data,
          label: "%",
          borderColor: "#3e95cd",
          backgroundColor: "#7bb6dd",
          fill: true,
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
    var diskChart = new Chart(disk_ctx, {
      type: 'line',
      data: {
        labels: diskusage_json.timestamps,
        datasets: [{
          //data: [86, 114, 106, 106, 107, 111, 133],
          data: diskusage_json.data,
          label: "%",
          borderColor: "#3e95cd",
          backgroundColor: "#7bb6dd",
          fill: true,
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }, [])
  return (
    <>
  <div className="float-container">

  <div className="float-child">
       MO Traffic
       <canvas id="moChart" width="400px" height="400px" ></canvas>
  </div>
  <div className="float-child">
       MT Traffic
       <canvas id="mtChart" width="400px" height="400px" ></canvas>
  </div>
  <div className="float-child">
       CPU Usage
       <canvas id="cpuuChart" width="400px" height="400px" ></canvas>
  </div>
  <div className="float-child">
       CPU Temp
       <canvas id="cputChart" width="400px" height="400px" ></canvas>
  </div>
  <div className="float-child">
       Memory Usage
       <canvas id="memChart" width="400px" height="400px" ></canvas>
  </div>
  <div className="float-child">
       Disk Usage
       <canvas id="diskChart" width="400px" height="400px" ></canvas>
  </div>
  </div>
    </>
  )
}

export default Example;
