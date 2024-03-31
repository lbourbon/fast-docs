const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { OpenAI } = require("openai");
const { toFile } = require("openai/uploads");
const cors = require('cors')({ origin: true });
const Busboy = require('busboy');

const app = express();
app.use(cors);
//openai = new OpenAI({ apiKey:  });

const serviceAccount = require("./chaveFastDocs.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fast-docs.firebaseio.com"
});

async function transcribe(file, audioName) {
  const fileStream = await toFile(file, audioName);
  const transcription = await openai.audio.transcriptions.create({
    file: fileStream,
    model: "whisper-1",
  });
  return transcription.text;
}


async function runPrompt(transcriptionText) {
  try {
    const chat_completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      response_format: { "type": "json_object" },
      messages: [
        { role: "system", content: `Responda apenas com o json_object(valores em branco caso não consiga definir), convertendo a informação para quatro chaves: 1)nome, 2)cpf(formato: xxx.xxx.xxx-xx), 3)valor (formato: R$XX,XX (valor por extenso em parenteses)) e 4)data (no formato yyyy-MM-dd) (se não fornecer, considerar a data de hoje` },
        { role: "user", content: transcriptionText }
      ],
    });
    return chat_completion.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao executar o modelo:", error);
    throw error;
  }
}

app.post('/open', (req, res) => {
  const busboyInstance = Busboy({ headers: req.headers });
  let fileData = Buffer.alloc(0);
  let audioName;


  busboyInstance.on('file', (fieldname, file, filename, encoding, mimetype) => {
    file.on('data', (data) => {
      fileData = Buffer.concat([fileData, data]);
      audioName = filename.filename

    });
    file.on('end', async () => {
      try {
        const texto = await transcribe(fileData, audioName);
        const resposta = await runPrompt(texto);
        res.send(resposta);
      } catch (error) {
        console.error("Erro na função principal:", error);
        res.status(500).send(error.request);
      }
    });
  });

  if (!req.rawBody) {
    console.error("Corpo da solicitação não disponível.");
    res.status(400).send('Solicitação inválida');
    return;
  }
  busboyInstance.end(req.rawBody);
});


exports.app = functions.https.onRequest(app);
