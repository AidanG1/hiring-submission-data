import './App.css';
import { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const renderLineChart = (data, num, title) => {
  return (
    <div className='container'>
      <h1>
        {num === 0 ? 'Traffic Change Over Time' : 'Layer 3 Traffic Over Time'}
      </h1>
      <LineChart width={1000} height={500} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        {num === 0 ?
          <><Line type="monotone" dataKey="http" stroke="red" /><Line type="monotone" dataKey="total" stroke="blue" /></> :
          <Line type="monotone" dataKey="percentage" stroke="red" />
        }
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Legend />
        <Tooltip />
      </LineChart>
    </div>
  )
};

function App() {
  // get data
  const routes = [
    'https://general.ttnt.workers.dev/traffic-change',
    'https://general.ttnt.workers.dev/popular-domains',
    'https://general.ttnt.workers.dev/layer3',
  ]

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const response = await Promise.all(routes.map(route => fetch(route)));
      const json = await Promise.all(response.map(res => res.json()));
      json[0] = convertTraffic(json[0]);
      // converting popular is unnecessary since it is just a table
      json[2] = convertLayer3(json[2]);
      setData(json);
      setLoading(false);
    }
    function convertTraffic(raw) {
      console.log(raw);
      let data = [];
      const num = (raw.data.http.length) / 2
      console.log(num);
      for (let i = 0; i < num; i++) {
        data.push({
          time: raw.data.http[i].value,
          http: raw.data.http[i + num].value,
          total: raw.data.total[i + num].value,
        })
      }
      console.log(data);
      return data;
    }
    function convertLayer3(raw) {
      let data = [];
      const num = (raw.data.length) / 2
      for (let i = 0; i < num; i++) {
        data.push({
          time: raw.data[i].value,
          percentage: raw.data[i + num].value,
        })
      }
      console.log(data);
      return data;
    }
    fetchData();
  }, []);


  return (
    <div>
      <div className="tabs is-centered">
        <ul>
          <li className={active === 0 ? 'is-active' : ''} onClick={() => setActive(0)}><a>Traffic Change</a></li>
          <li className={active === 1 ? 'is-active' : ''} onClick={() => setActive(1)}><a>Popular Domains</a></li>
          <li className={active === 2 ? 'is-active' : ''} onClick={() => setActive(2)}><a>Layer 3</a></li>
          <li className={active === 3 ? 'is-active' : ''} onClick={() => setActive(3)}><a>About</a></li>
        </ul>
        {active}
      </div>
      {
        active === 0 ?
          loading ? <p>Loading...</p> : renderLineChart(data[0], 0) :
          active === 1 ? <>
            <h1>Popular Domains</h1>
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Rank Change</th>
                  <th>Domain</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {data !== null ? data[active].rankingEntries.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.rank}</td>
                      {
                        item.rankChange === '0' ? <td>0</td> :
                          item.rankChange > 0 ? <td className="has-text-success">+{item.rankChange}</td> :
                            <td className="has-text-danger">{item.rankChange}</td>
                      }
                      <td><a href={`https://${item.domain}`} target="_blank">{item.domain}</a></td>
                      <td>{item.category}</td>
                    </tr>
                  )
                }) : null}
              </tbody>
            </table>
          </>
            : active === 2 ? loading ? <p>Loading...</p> : renderLineChart(data[2], 2) :
              <div className="container">
                <h1>About</h1>
                <p>This is the Cloudflare coding challenge created by Aidan Gerber.</p>
                <a href="https://github.com/AidanG1/hiring-submission-data" target="_blank">Github Repo</a>
              </div>

      }
    </div>
  );
}

export default App;
