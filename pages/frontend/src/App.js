import './App.css';
import { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const renderLineChart = (data) => {
  console.log(data);
  return (
    <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
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
      setData(json);
      setLoading(false);
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
        </ul>
        {active}
      </div>
      <div>
        {loading ? 'Loading...' : renderLineChart(data[active])}
      </div>
    </div>
  );
}

export default App;
