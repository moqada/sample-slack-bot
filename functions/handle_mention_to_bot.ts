import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import {
  EnrichedSlackFunctionHandler,
} from "deno-slack-sdk/functions/types.ts";
import { bot, createRespond } from "../bot/mod.ts";
import { BotResponse, ChannelType } from "../bot/types.ts";
import { getThreadTs } from "../lib/slack_api.ts";
import { BotResponseType } from "./respond_as_bot.ts";

export const handleMentionToBotFunctionDef = DefineFunction({
  callback_id: "handle_mention_to_bot",
  title: "Handle a mention to bot",
  source_file: "functions/handle_mention_to_bot.ts",
  description: "Handle a mention to bot",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      channelType: { type: Schema.types.string },
      userId: { type: Schema.slack.types.user_id },
      message: { type: Schema.types.string },
      messageTs: { type: Schema.types.string },
      threadTs: { type: Schema.types.string },
      // for debug and workaround
      data: { type: Schema.types.object },
      isQuickResponseEnabled: { type: Schema.types.boolean },
    },
    required: ["channelId", "channelType", "userId", "message", "messageTs"],
  },
  output_parameters: {
    properties: {
      type: { type: BotResponseType },
      channelId: { type: Schema.slack.types.channel_id },
      text: { type: Schema.types.string },
      mentionUserId: { type: Schema.types.string },
      emoji: { type: Schema.types.string },
      messageTs: { type: Schema.types.string },
      threadTs: { type: Schema.types.string },
    },
    required: ["type"],
  },
});

type FunctionHandler = EnrichedSlackFunctionHandler<
  typeof handleMentionToBotFunctionDef["definition"]
>;
type FunctionHandlerContext = Parameters<FunctionHandler>[0];
type OutputFunction = (
  res: BotResponse,
) => Promise<ReturnType<FunctionHandler>>;

const createResponder = (
  { client, inputs }: {
    client: SlackAPIClient;
    inputs: {
      channelId: string;
      isQuickResponseEnabled?: boolean;
      threadTs?: string;
    };
  },
) => {
  const respond = createRespond({
    client,
    channelId: inputs.channelId,
    threadTs: inputs.threadTs,
  });
  const output: OutputFunction = async (response) => {
    if (response.type === "none") {
      return { outputs: { type: "none" } };
    } else if (inputs.isQuickResponseEnabled) {
      await respond(response);
      return { outputs: { type: "none" } };
    }
    return {
      outputs: {
        ...response,
        channelId: inputs.channelId,
        threadTs: inputs.threadTs,
      },
    };
  };
  return {
    respond,
    output,
  };
};

type OutputCommandNotFound = (
  ctx: {
    command: string;
    output: OutputFunction;
    inputs: FunctionHandlerContext["inputs"];
  },
) => Promise<ReturnType<FunctionHandler>>;
type OutputCommandError = (
  ctx: {
    command: string;
    error: unknown;
    inputs: FunctionHandlerContext["inputs"];
    output: OutputFunction;
  },
) => Promise<ReturnType<FunctionHandler>>;

const createHandleMentionToBot = (
  {
    outputCommandError = ({ error, output }) => {
      return output({
        type: "message",
        text: `Unexpected Error :sob:
\`\`\`
${error}
\`\`\`
`,
      });
    },
    outputCommandNotFound = ({ command, output }) => {
      return output({ type: "message", text: `\`${command}\` is not found` });
    },
  }: {
    outputCommandError?: OutputCommandError;
    outputCommandNotFound?: OutputCommandNotFound;
  },
): FunctionHandler => {
  return async ({ client, env, inputs }) => {
    const resTest = await client.auth.test();
    if (!resTest.ok) {
      throw new Error("client.api.test failed", { cause: resTest.error });
    }
    const mentionRegex = new RegExp(`^<@${resTest.user_id}>\\s*`);
    if (!mentionRegex.test(inputs.message)) {
      return { outputs: { type: "none" } };
    }
    const command = inputs.message.replace(mentionRegex, "");
    const threadTs = inputs.threadTs ||
      await getThreadTs({
        client,
        channelId: inputs.channelId,
        messageTs: inputs.messageTs,
      });
    const { respond, output } = createResponder({
      client,
      inputs: { ...inputs, threadTs },
    });
    const handler = bot.mentions.find((h) => h.pattern.test(command));
    const match = handler && handler.pattern.exec(command);
    if (!handler || !match) {
      return outputCommandNotFound({ command, inputs, output });
    }
    try {
      const res = await handler.func({
        bot,
        env,
        message: {
          match,
          channelId: inputs.channelId,
          channelType: inputs.channelType as ChannelType,
          userId: inputs.userId,
          messageTs: inputs.messageTs,
          threadTs: inputs.threadTs,
        },
        respond,
      });
      return output(res);
    } catch (error) {
      return outputCommandError({ command, error, inputs, output });
    }
  };
};

export default SlackFunction(
  handleMentionToBotFunctionDef,
  createHandleMentionToBot({
    outputCommandError: ({ error, output }) => {
      return output({
        type: "message",
        text: `予期しないエラーが発生しました :sob:
\`\`\`
${error}
\`\`\``,
      });
    },
    outputCommandNotFound: ({ command, output }) => {
      // return output({ type: "none" });
      return output({
        type: "message",
        text: `\`${command}\` にマッチするコマンドがないで
\`@sample-slack-bot help\` を実行してや`,
      });
    },
  }),
);
