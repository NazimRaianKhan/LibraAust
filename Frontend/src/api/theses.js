// src/api/theses.js

export const THESIS_DEPARTMENTS = [
  "All Departments",
  "Computer",
  "Electrical",
  "Mechanical",
  "Civil",
  "Architecture",
];

export const theses = [
  {
    id: "ml-network-traffic",
    title: "Machine Learning Approaches for Network Traffic Classification",
    author: "Ahmed Rahman",
    year: 2024,
    pages: 85,
    supervisor: "Dr. Mohammad Hassan",
    department: "Computer",
    level: "Masters",
    keywords: ["Machine Learning", "Network Traffic", "Classification", "Deep Learning"],
    abstract:
      "This thesis explores various machine learning algorithms for classifying network traffic in real-time environments, comparing supervised and deep models under constrained resources.",
    description:
      "We evaluate SVM, Random Forest, and CNN/LSTM hybrids on multiple public datasets (CIC-IDS, UNSW-NB15) and a lab-captured stream. The work discusses feature engineering pipelines, latency/throughput trade‑offs, and deployability in edge gateways.",
    thumbnail:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    pdfUrl: "#",
  },
  {
    id: "iot-smart-grid",
    title: "Smart Grid Implementation Using IoT Technologies",
    author: "Nusrat Jahan",
    year: 2024,
    pages: 92,
    supervisor: "Dr. Saifullah Khan",
    department: "Electrical",
    level: "Masters",
    keywords: ["IoT", "Smart Grid", "Energy Efficiency"],
    abstract:
      "Design and prototype of an IoT‑enabled smart grid node with demand response, predictive load balancing and security hardening.",
    description:
      "Presents a modular architecture using MQTT, edge ML for anomaly detection, and secure OTA updates. Includes a field pilot across 20 households.",
    thumbnail:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1200&auto=format&fit=crop",
    pdfUrl: "#",
  },
  {
    id: "engine-heat-transfer",
    title: "Heat Transfer Enhancement in Automotive Engines",
    author: "Tanvir Ahmed",
    year: 2024,
    pages: 88,
    supervisor: "Dr. Shahidul Islam",
    department: "Mechanical",
    level: "Masters",
    keywords: ["Heat Transfer", "Automotive", "Thermal Efficiency", "Engine Cooling"],
    abstract:
      "Investigation of advanced cooling techniques for improving thermal efficiency in automotive engines.",
    description:
      "Compares nano‑fluid coolants and micro‑channel heat exchangers in a controlled bench with CFD validation.",
    thumbnail:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    pdfUrl: "#",
  },
  {
    id: "blockchain-scm",
    title: "Blockchain‑based Supply Chain Management System",
    author: "Marium Akter",
    year: 2023,
    pages: 82,
    supervisor: "Dr. Rezaul Karim",
    department: "Computer",
    level: "Masters",
    keywords: ["Blockchain", "Supply Chain", "Security", "Transparency"],
    abstract:
      "Development of a secure and transparent supply chain management system using blockchain technology.",
    description:
      "Explores permissioned ledgers, on‑chain provenance, and privacy‑preserving audits, with a case study in food logistics.",
    thumbnail:
      "https://images.unsplash.com/photo-1530533718754-001d2668365a?q=80&w=1200&auto=format&fit=crop",
    pdfUrl: "#",
  },
];

export function getThesisById(id) {
  return theses.find((t) => t.id === id);
}
