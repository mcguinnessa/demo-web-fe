import { useEffect } from "react"
//import { Chart } from "chart.js";
import { Chart } from "chart.js/auto";
import 'chartjs-adapter-luxon';

import styles from '../styles.module.css'
require('events').EventEmitter.prototype._maxListeners = 100;




export async function getStaticProps() {

  const wrapper_host = process.env.WRAPPER_HOST
  const wrapper_port = process.env.WRAPPER_PORT

  var wrapper_url = ""
  if (typeof wrapper_port !== 'undefined' && wrapper_port !== null && wrapper_port !== ""){
     wrapper_url = wrapper_host + ":" + wrapper_port + "/" 
  } else {
     wrapper_url = wrapper_host + "/" 
  }	 

  console.log("Requesting:" + wrapper_url)

  var mo_json = {timestamps : "No Data", data: "No Data"}
  var mt_json = {timestamps : "No Data", data: "No Data"}
  var cpuusage_json = {timestamps : "No Data", data: "No Data"}
  var cputemp_json = {timestamps : "No Data", data: "No Data"}
  var memusage_json = {timestamps : "No Data", data: "No Data"}
  var diskusage_json ={timestamps : "No Data", data: "No Data"}

  try {
    const mo_resp  = await fetch(wrapper_url+"motraffic")
    const mt_resp  = await fetch(wrapper_url+"mttraffic")
    const cpuusage_resp  = await fetch(wrapper_url+"cpuusage")
    const cputemp_resp  = await fetch(wrapper_url+"cputemp")
    const memusage_resp  = await fetch(wrapper_url+"memusage")
    const diskusage_resp  = await fetch(wrapper_url+"diskusage")

    mo_json = await mo_resp.json()
    mt_json = await mt_resp.json()
    cpuusage_json = await cpuusage_resp.json()
    cputemp_json = await cputemp_resp.json()
    memusage_json = await memusage_resp.json()
    diskusage_json = await diskusage_resp.json()
  } catch (err) {
    console.log("Failed to get data:" + err);
  }

  return {
    props: {
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
          borderColor: "#2d0ce8",
          backgroundColor: "#6a53ed",
          fill: false,
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
	plugins: {
            title: {
                display: true,
                text: 'MO Traffic'
            }
        },
	scales: {
	  x: {
            type: 'time',
	    time: {
	       unit: 'hour'
	    }
	  },
	  y: {
	    ticks: {
              callback: function(value, index, ticks) {
              return (value / 1000000) + "M";
              }
	    }
	  }
	}
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
        //borderColor: "#3e95cd",
	borderColor: "#db2751",
        backgroundColor: "#db4064",
        fill: false,
      }
      ]
    },
      options: {
	//responsive means the chart is resized when the window is
        responsive: true,
        maintainAspectRatio: false,
	plugins: {
            title: {
                display: true,
                text: 'MT Traffic'
            }
        },
	scales: {
	  x: {
            type: 'time',
	    time: {
	       unit: 'hour'
	    }
	  },
	  y: {
	    ticks: {
              callback: function(value, index, ticks) {
              return (value / 1000000) + "M";
              //return '$' + value;
              }
	    }
	  }
	}
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
          borderColor: "#e3d110",
          backgroundColor: "#e3d754",
          fill: false,
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
	plugins: {
            title: {
                display: true,
                text: 'CPU Usage'
            }
        },
	scales: {
	  x: {
            type: 'time',
	    time: {
	       unit: 'hour'
	    }
	  },
	  y: {
	    min: 0,
	    max: 100
	  }
	}
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
          borderColor: "#0be6cc",
          backgroundColor: "#54f0de",
          fill: false,
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
	plugins: {
            title: {
                display: true,
                text: 'CPU Temperature'
            }
        },
	scales: {
	  x: {
            type: 'time',
	    time: {
	       unit: 'hour'
	    }
	  }
	}
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
          borderColor: "#d90bcb",
          backgroundColor: "#d173cb",
          fill: false,
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
	plugins: {
            title: {
                display: true,
                text: 'Memory Usage'
            }
        },
	scales: {
	  x: {
            type: 'time',
	    time: {
	       unit: 'hour'
	    }
	  },
	  y: {
	    min: 0,
	    max: 100
	  }
	}
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
          borderColor: "#17e34d",
          backgroundColor: "#61e885",
          fill: true,
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
	plugins: {
            title: {
                display: true,
                text: 'Disk Usage'
            }
        },
	scales: {
	  x: {
            type: 'time',
	    time: {
	       unit: 'day'
	    }
	  },
	  y: {
	    min: 0,
	    max: 100
	  }
	}
      }
    });
  }, [])
  return (
    <>
  <div className={styles.container}>
       <div className={styles.chart1}><canvas id="moChart" ></canvas></div>
       <div className={styles.chart2}><canvas id="mtChart" ></canvas></div>
       <div className={styles.chart3}><canvas id="cpuuChart" ></canvas></div>
  </div>
  <div className={styles.container}>
       <div className={styles.chart4}><canvas id="cputChart" ></canvas></div>
       <div className={styles.chart5}><canvas id="memChart" ></canvas></div>
       <div className={styles.chart6}><canvas id="diskChart" ></canvas></div>
  </div>

    </>
  )
}

export default Example;

/*
  <div className={styles.floatcontainer}>

  <div className={styles.floatchild}>
       MO Traffic
       <canvas id="moChart" width="400px" height="400px" ></canvas>
  </div>
  <div className={styles.floatchild}>
       MT Traffic
       <canvas id="mtChart" width="400px" height="400px" ></canvas>
  </div>
  <div className={styles.floatchild}>
       CPU Usage
       <canvas id="cpuuChart" ></canvas>
  </div>
  <div className={styles.floatchild}>
       CPU Temp
       <canvas id="cputChart" ></canvas>
  </div>
  <div className={styles.floatchild}>
       Memory Usage
       <canvas id="memChart" width="400px" height="400px" ></canvas>
  </div>
  <div className={styles.floatchild}>
       Disk Usage
       <canvas id="diskChart" width="400px" height="400px" ></canvas>
  </div>
  </div>
  */
