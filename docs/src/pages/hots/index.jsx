import { useState, useEffect } from "react";
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import dayjs from 'dayjs'
import "./index.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const URL = "https://cdn.jsdelivr.net/gh/xiadd/tg-wb-trending"

export default function Hots() {
  const query = useQuery()
  const match = useRouteMatch()
  const [hots, setHots] = useState([]);
  const [loading, setLoading] = useState(true)
  const date = query.get('date')
  const _date = date ? dayjs(date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
  const fetchHots = async () => {
    setLoading(true)
    const res = await fetch(`${URL}/api/${_date}.json`);
    const data = await res.json();
    setHots(data);
    setLoading(false)
  };

  useEffect(() => {
    fetchHots()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_date]);
  return (
    <div className="hot-container">
      <section className="page-header bg-dark">
        <h1 className="hot-date font-bold">{_date}</h1>
        <h5 className="hot-desc">微博热搜</h5>
        {!dayjs(_date).subtract(1, 'd').isBefore(dayjs('2020-12-27')) && <Link
          to={`${match.url}?date=${dayjs(_date).subtract(1, 'd').format('YYYY-MM-DD')}`}
          className="btn btn-secondary fw-bold border-white bg-white text-dark mt-2"
        >
          前一天
        </Link>}
        {!dayjs(_date).add(1, 'd').isAfter(dayjs()) && <Link
          to={`${match.url}?date=${dayjs(_date).add(1, 'd').format('YYYY-MM-DD')}`}
          className="btn btn-secondary fw-bold border-white bg-white text-dark mt-2" style={{ marginLeft: 10 }}
        >
          后一天
        </Link>}
      </section>
      <div className="container mt-4">
        {loading
          ? <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          : <ul>
          {hots.map(item => (
            <li key={item.title} className="hot-item">
              <p className="fs-6">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
                <span className={`badge bg-secondary`} style={{ verticalAlign: 'text-bottom', marginLeft: 5 }}>{item.category}</span>
              </p>
              <p className="text-secondary" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.description || '暂无描述'}</p>
            </li>
          ))}
        </ul>}
      </div>
    </div>
  );
}
