// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";

const DEFAULT_USER = {
  name: "John Doe",
  role: "Student",
  department: "Computer Science & Engineering",
  email: "takeyahya6@gmail.com",
  phone: "+880-1712345678",
  address: "Dhaka, Bangladesh",
  academic: {
    studentId: "2021-1-60-001",
    currentSemester: "8th Semester",
    enrollmentDate: "February 1, 2021",
  },
  borrowed: [
    { title: "Introduction to Algorithms", author: "Thomas H. Cormen", borrowed: "1/15/2025", due: "1/29/2025", overdueDays: 205, renewed: "0/1" },
    { title: "Computer Networks", author: "Andrew S. Tanenbaum", borrowed: "1/10/2025", due: "1/24/2025", overdueDays: 210, renewed: "1/1" },
  ],
  history: [
    { title: "Database System Concepts", author: "Abraham Silberschatz", borrowed: "12/1/2024", returned: "12/15/2024" },
    { title: "Software Engineering", author: "Ian Sommerville", borrowed: "11/15/2024", returned: "11/29/2024" },
    { title: "Machine Learning", author: "Tom M. Mitchell", borrowed: "11/1/2024", returned: "11/16/2024" },
  ],
};

export default function ProfilePage() {
  const [user, setUser] = useState(DEFAULT_USER);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        // 🔹 Map API response into the structure your UI expects
        const formatted = {
          name: data.name,
          role: data.role || "Student",
          department: data.department || "Unknown",
          email: data.email,
          phone: data.phone || "",
          address: data.address || "",
          academic: {
            studentId: data.academic.studentId,
            currentSemester: data.academic.currentSemester || "",
            enrollmentDate: data.academic.enrollmentDate || "",
          },
          borrowed: data.borrowed_books || [],
          history: data.history || [],
        };

        setUser(formatted);
        localStorage.setItem("libra_profile", JSON.stringify(formatted));
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        const saved = localStorage.getItem("libra_profile");
        if (saved) setUser(JSON.parse(saved));
      });
  }, []);

    
    const save = async () => {
      localStorage.setItem("libra_profile", JSON.stringify(user));
      // setEditing(false);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://127.0.0.1:8000/api/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: user.phone,
          department: user.department,
          academic: {
            studentId: user.academic.studentId,
            currentSemester: user.academic.currentSemester,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updated = await res.json();

      // Map backend fields back into our local state shape
      const refreshed = {
        ...user,
        phone: updated.phone,
        department: updated.department,
        academic: {
          ...user.academic,
          studentId: updated.student_id,
          currentSemester: updated.semester,
        },
      };

      setUser(refreshed);
      localStorage.setItem("libra_profile", JSON.stringify(refreshed));
      setEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to update profile");
    }
  };


  // };

  return (
    <div>
      <section className="container mx-auto px-6 pt-10 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
              {(user.name || "JD").split(" ").map((s) => s[0]).join("")}
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <div className="text-gray-600">{user.role} · {user.department}</div>
            </div>
          </div>
          <button
            onClick={() => (editing ? save() : setEditing(true))}
            className="h-10 px-4 rounded-xl bg-gray-900 text-white"
          >
            {editing ? "Save" : "Edit Profile"}
          </button>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold mb-4">Personal Information</h2>
          <Field label="Email" value={user.email} editing={editing} onChange={(v)=>setUser({...user, email:v})} />
          <Field label="Phone" value={user.phone} editing={editing} onChange={(v)=>setUser({...user, phone:v})} />
          <Field label="Address" value={user.address} editing={editing} onChange={(v)=>setUser({...user, address:v})} />
        </div>

        {/* Borrowed Books */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold mb-4">Currently Borrowed Books ({user.borrowed.length})</h2>
          <div className="space-y-4">
            {user.borrowed.map((b, i) => (
              <div key={i} className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
                <div>
                  <div className="font-medium">{b.title}</div>
                  <div className="text-sm text-gray-600">{b.author}</div>
                  <div className="text-xs text-gray-500">Borrowed: {b.borrowed} · Due: {b.due} · Renewed {b.renewed}</div>
                </div>
                {b.overdueDays > 0 && (
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                    Overdue by {b.overdueDays} days
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Academic Info */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold mb-4">Academic Details</h2>
          <Field label="Student ID" value={user.academic.studentId} editing={editing} onChange={(v)=>setUser({...user, academic:{...user.academic, studentId:v}})} />
          <Field label="Department" value={user.department} editing={editing} onChange={(v)=>setUser({...user, department:v})} />
          <Field label="Current Semester" value={user.academic.currentSemester} editing={editing} onChange={(v)=>setUser({...user, academic:{...user.academic, currentSemester:v}})} />
          {/* <Field label="Enrollment Date" value={user.enrollmentDate} editing={editing} onChange={(v)=>setUser({...user, academic:{...user.academic, enrollmentDate:v}})} /> */}
        </div>

        {/* History */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold mb-4">Recent Borrowing History</h2>
          <div className="divide-y divide-gray-200">
            {user.history.map((h, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{h.title}</div>
                  <div className="text-sm text-gray-600">{h.author}</div>
                </div>
                <div className="text-xs text-gray-500">
                  Borrowed: {h.borrowed} · Returned: {h.returned}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, editing, onChange }) {
  return (
    <div className="mb-3">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</div>
      {editing ? (
        <input value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full h-10 rounded-lg border border-gray-300 px-3" />
      ) : (
        <div className="text-gray-700">{value}</div>
      )}
    </div>
  );
}
