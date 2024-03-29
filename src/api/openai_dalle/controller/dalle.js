const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateResponse(ctx) {
   // console.log("entre aqui");
    const { prompt } = ctx.request.body;

    try { 
        const response = await openai.createImage({
              prompt: prompt,
              n: 3,
              size: "512x512",
            });
        
            console.log(response.data.data);
            ctx.send({ data: response.data.data });

      } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }
  }
};