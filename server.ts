import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Delivery {
  deliveryId: number;
  name: string;
  date: string;
  status: string;
}

let deliveries: Delivery[] = [
  { deliveryId: 101, name: "Sample Package", date: "2026-05-01", status: "Pending" }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/delivery/add", (req, res) => {
    const delivery: Delivery = req.body;
    if (!delivery.deliveryId) {
      return res.status(400).json({ error: "Delivery ID MUST be provided manually" });
    }
    deliveries.push(delivery);
    console.log("Added Delivery:", delivery);
    res.status(201).json(delivery);
  });

  app.put("/delivery/update/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const updateData: Delivery = req.body;
    const index = deliveries.findIndex(d => d.deliveryId === id);

    if (index !== -1) {
      deliveries[index] = { ...deliveries[index], ...updateData };
      console.log(`Updated Delivery ${id}:`, deliveries[index]);
      return res.json(deliveries[index]);
    }
    res.status(404).json({ error: "Delivery not found" });
  });

  app.get("/delivery/all", (req, res) => {
    res.json(deliveries);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
