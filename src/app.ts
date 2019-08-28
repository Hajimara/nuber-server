import cors from "cors";
import { GraphQLServer } from "graphql-yoga";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";
import { NextFunction, Response } from "express";

class App {
  public app: GraphQLServer;

  // context graphql resolvers가 가지고 있는 것으로
  // context안에 데이터를 넣으면 모든 resolvers로 보낼 수 있다.
  // 기본적으로 server의 정보
  constructor() {
    this.app = new GraphQLServer({
      schema,
      context: req => {
        return {
          req: req.request
        };
      }
    });
    this.middlewares();
  }

  private middlewares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(logger("dev"));
    this.app.express.use(helmet());
    this.app.express.use(this.jwt);
  };

// 미들 웨어를 거치는 순간 유저 데이터를 토큰과 함께 request에 담아 graphql server에 보내는 작업
  private jwt = async (req, res:Response, next:NextFunction): Promise<void> => {
    const token = req.get("X-JWT");
    if (token) {
      const user = await decodeJWT(token);
      if (user) {
        req.user = user;
      } else {
        req.user = undefined;
      }
    }
    next();
  };
}

export default new App().app;
