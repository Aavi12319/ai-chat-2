import formidable from 'formidable';
import fs from 'fs';
import Replicate from 'replicate';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const form = new formidable.IncomingForm();
  form.multiples = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing form data' });
      return;
    }

    let context = '';
    const uploadedFiles = files.files instanceof Array ? files.files : [files.files];
    for (const file of uploadedFiles) {
      const content = fs.readFileSync(file.filepath, 'utf-8');
      context += content + '\\n';
    }

    const prompt = fields.prompt || '';
    const combinedPrompt = context + '\\n' + prompt;

    try {
      const output = await replicate.run(
        "meta/codellama-7b-instruct",
        { input: { prompt: combinedPrompt, max_length: 512, temperature: 0.2 } }
      );

      res.status(200).json({ completion: output.join('') });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
