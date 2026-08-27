import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { recipesRouter } from './routes/recipes.js';
import { plannerRouter } from './routes/planner.js';
import { shoppingRouter } from './routes/shopping.js';
import { materialsRouter } from './routes/materials.js';
import { supportRouter } from './routes/support.js';
import { adminRouter } from './routes/admin.js';
import { webhooksRouter } from './routes/webhooks.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// Rotas da API
app.use('/api/auth', authRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/planner', plannerRouter);
app.use('/api/shopping', shoppingRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/support', supportRouter);
app.use('/api/admin', adminRouter);
app.use('/api/webhooks', webhooksRouter);

// Root / Health check
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Cardápio Seletivo API</title></head>
      <body style="font-family: sans-serif; background: #FFF9EE; color: #116B4C; padding: 40px; text-align: center;">
        <h2>🌿 Cardápio Seletivo — API Backend Ativa</h2>
        <p style="color: #26332D;">Esta porta (5000) é exclusiva para os serviços de API da aplicação.</p>
        <p><a href="http://localhost:5173" style="display: inline-block; padding: 12px 24px; background: #116B4C; color: white; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 10px;">👉 Abrir o Aplicativo Visual (http://localhost:5173)</a></p>
      </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'Cardápio Seletivo API',
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`🌿 Cardápio Seletivo API rodando na porta ${port}`);
});
