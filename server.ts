import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
// Utiliser un port différent de celui de Vite (qui est souvent 3000 ou 5173)
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes basiques
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Le serveur backend fonctionne correctement !' });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré en mode développement sur http://localhost:${port}`);
});
