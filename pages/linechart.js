import { useEffect } from "react"
import { Chart } from "chart.js";


export async function getStaticProps() {

  const wrapper_host = process.env.WRAPPER_HOST
  const wrapper_port = process.env.WRAPPER_PORT
  const wrapper_metric = process.env.WRAPPER_METRIC
  const wrapper_url = "http://" + wrapper_host + ":" + wrapper_port + "/" + wrapper_metric
  console.log(wrapper_url)


  //const res = await fetch('https://api.github.com/repos/developit/preact')
  //const response  = await fetch('ec2-3-8-157-149.eu-west-2.compute.amazonaws.com:3000/motraffic')
  const mo_resp  = await fetch('http://ec2-3-8-157-149.eu-west-2.compute.amazonaws.com:3000/motraffic')
  const mo_json = await mo_resp.json()
  const mt_resp  = await fetch('http://ec2-3-8-157-149.eu-west-2.compute.amazonaws.com:3000/motraffic')
  const mt_json = await mt_resp.json()
  console.log("IS OK")
  console.log(mo_resp.ok)
  console.log(mo_json)
  console.log(mt_json)
  console.log("AFTER2")

  return {
    props: {
      //stars: json.stargazers_count,
      mo_json,
      mt_json
    },
  }
}


function Example({mo_json, mt_json}) {


  useEffect(() => {

    var mo_ctx = document.getElementById('moChart').getContext('2d');
    var mt_ctx = document.getElementById('mtChart').getContext('2d');
    var moChart = new Chart(mo_ctx, {
      type: 'line',
      data: {
        //labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        labels: mo_json.timestamps,
        datasets: [{
          //data: [86, 114, 106, 106, 107, 111, 133],
          data: mo_json.data,
          label: "MO",
          borderColor: "#3e95cd",
          backgroundColor: "#7bb6dd",
          fill: false,
        }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 5,
            left: 35,
            right: 35,
            bottom: 15
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
        borderColor: "#3e95cd",
        backgroundColor: "#7bb6dd",
        fill: false,
      }
      ]
    },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 5,
            left: 35,
            right: 35,
            bottom: 15
          }
	}
      }
  });
  }, [])
  return (
    <>
  <div>
      <canvas id="moChart" width="440px" height="440px"></canvas>
      <canvas id="mtChart" width="440px" height="440px"></canvas>
  </div>

  <div>
      <canvas id="mtChart" width="440px" height="440px"></canvas>
  </div>

    </>
  )
}

export default Example;
