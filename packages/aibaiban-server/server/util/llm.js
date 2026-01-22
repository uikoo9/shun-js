// llm
const { GeminiVertex } = require('viho-llm');

// gemini
const gemini = GeminiVertex({
  projectId: global.QZ_CONFIG.gemini.projectId,
  location: global.QZ_CONFIG.gemini.location,
  modelName: global.QZ_CONFIG.gemini.modelName,
});

exports.chatWithStreaming = async (userPrompts, callbackOptions) => {
  // Send a chat message with streaming
  await gemini.chatWithStreaming(
    {
      contents: [
        {
          role: 'user',
          parts: userPrompts,
        },
      ],
    },
    callbackOptions,
  );
};
