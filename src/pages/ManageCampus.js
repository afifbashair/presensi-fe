import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import "../styles/admin.css";

export default function ManageCampus() {

  const [
    campuses,
    setCampuses,
  ] = useState([]);

  const [
    editId,
    setEditId,
  ] = useState(null);

  const [
    form,
    setForm,
  ] = useState({

    name: "",

    latitude: "",

    longitude: "",

    radius: "",
  });

  // =========================
  // FETCH
  // =========================

  const fetchData =
    async () => {

      const res =
        await API.get(
          "/campus"
        );

      setCampuses(
        res.data
      );
    };

  useEffect(() => {
    fetchData();
  }, []);


  // =========================
  // SUBMIT
  // =========================

  const handleSubmit =
    async () => {

      try {

        if (editId) {

          await API.put(
            `/campus/${editId}`,
            form
          );

          alert(
            "Campus berhasil diupdate"
          );

        } else {

          await API.post(
            "/campus",
            form
          );

          alert(
            "Campus berhasil ditambahkan"
          );
        }

        setForm({

          name: "",

          latitude: "",

          longitude: "",

          radius: "",
        });

        setEditId(null);

        fetchData();

      } catch (err) {

        alert(
          err.response?.data?.message
        );
      }
    };


  // =========================
  // DELETE
  // =========================

  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Hapus campus?"
        )
      ) return;

      await API.delete(
        `/campus/${id}`
      );

      fetchData();
    };


  // =========================
  // EDIT
  // =========================

  const handleEdit =
    (c) => {

      setForm({

        name:
          c.name,

        latitude:
          c.latitude,

        longitude:
          c.longitude,

        radius:
          c.radius,
      });

      setEditId(c.id);

      window.scrollTo({

        top: 0,

        behavior: "smooth",
      });
    };


  return (

    <div className="admin-container">

      <h2>
        Kelola Campus
      </h2>

      {/* FORM */}

      <div className="admin-form">

        <input
          placeholder="Nama Campus"

          value={form.name}

          onChange={(e) =>
            setForm({

              ...form,

              name:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Latitude"

          value={form.latitude}

          onChange={(e) =>
            setForm({

              ...form,

              latitude:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Longitude"

          value={form.longitude}

          onChange={(e) =>
            setForm({

              ...form,

              longitude:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Radius (meter)"

          value={form.radius}

          onChange={(e) =>
            setForm({

              ...form,

              radius:
                e.target.value,
            })
          }
        />

        <button
          onClick={handleSubmit}
        >
          {editId
            ? "Update Campus"
            : "Tambah Campus"}
        </button>

      </div>


      {/* TABLE */}

      <table className="admin-table">

        <thead>

          <tr>

            <th>ID</th>

            <th>Nama</th>

            <th>Latitude</th>

            <th>Longitude</th>

            <th>Radius</th>

            <th>Aksi</th>

          </tr>

        </thead>


        <tbody>

          {campuses.map((c) => (

            <tr key={c.id}>

              <td>
                {c.id}
              </td>

              <td>
                {c.name}
              </td>

              <td>
                {c.latitude}
              </td>

              <td>
                {c.longitude}
              </td>

              <td>
                {c.radius} m
              </td>

              <td>

                <button
                  className="edit-btn"

                  onClick={() =>
                    handleEdit(c)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"

                  onClick={() =>
                    handleDelete(c.id)
                  }
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}