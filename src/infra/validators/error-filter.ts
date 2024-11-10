import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { Telegraf } from 'telegraf';
import * as process from 'process';

const token = process.env.ERROR_BOT_TOKEN;
const app = new Telegraf(token, {});
const CHATID = process.env.CHATID;

@Catch(HttpException)
class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status > 299) {
      (async () => {
        try {
          await app.telegram.sendMessage(Number(CHATID), `\`\`\`json\n${JSON.stringify(exception, null, 4)}\`\`\``, { parse_mode: 'MarkdownV2' });
        } catch (e) {
          console.log(e);
        }
      })();
    }
    response.status(status).json({
      data: null,
      success: false,
      error: {
        ...exception['response'],
      },
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }
}

export default ErrorFilter;
