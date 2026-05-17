import { useEffect, useState } from "react";
import API from "../services/api";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/attendance/me").then((res) => {
      setData(res.data.data || []);
    });
  }, []);

  return (
    <div>
      <h2>Riwayat Presensi</h2>

      {data.length === 0 ? (
        <p>Belum ada data</p>
      ) : (
        data.map((item) => (
          <div key={item.id}>
            <p>{item.campus_name}</p>
            <p>{new Date(item.check_in_time).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}