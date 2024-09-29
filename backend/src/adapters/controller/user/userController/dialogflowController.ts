import { Request, Response } from 'express';
import { SessionsClient } from '@google-cloud/dialogflow';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default (dependencies: any) => {
  const dialogflowController = async (req: Request, res: Response) => {
    const keyFilename = path.resolve(__dirname, '../../../../adapters/controller/user/userController/hasthChatbot.json');
    const client = new SessionsClient({ keyFilename: keyFilename });

   
    let sessionId = req.cookies.dialogflowSessionId;
    if (!sessionId) {
      sessionId = uuidv4();
      res.cookie('dialogflowSessionId', sessionId, { 
        httpOnly: true, 
        secure: true,
        maxAge: 24 * 60 * 60 * 1000 
      });
    }

    const sessionPath = client.projectAgentSessionPath('hasth-xrkj', sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: req.body.queryInput.text.text,
          languageCode: 'en-US',
        },
      },
    };

    try {
      const responses = await client.detectIntent(request);
      const result = responses[0]?.queryResult;

      res.json({ fulfillmentText: result?.fulfillmentText });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error connecting to Dialogflow');
    }
  };

  return dialogflowController;
};