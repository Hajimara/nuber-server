import cors from "cors";
import { GraphQLServer, PubSub } from "graphql-yoga";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";
import { NextFunction, Response } from "express";

class App {
  public app: GraphQLServer;
  public pubSub: any;
  // context graphql resolvers가 가지고 있는 것으로
  // context안에 데이터를 넣으면 모든 resolvers로 보낼 수 있다.
  // 기본적으로 server의 정보
  //  Subscription 타입은 pusSub할 때 보내는 데이터 타입이다.
  // context에서 꺼내 쓸 수 있다.
  constructor() {
    this.pubSub = new PubSub();
    // graphql-yoga에서 제공하는 pubsub은 메모리 누수 이슈도 있다고 한다.
    // 그렇기 때문에 실제 서비스 될 때는 graphql-yoga의 pubsub이 아닌 다른 pubsub을 사용하자.
    this.pubSub.ee.setMaxListeners(99);
    //
    this.app = new GraphQLServer({
      schema,
      context: req => {
        // 아래 문법 해석 connection 이 존재하지 안으면 {}을 할당 context가 존재하지 않으면 Null 기본값 할당
        const { connection: { context = null } = {} } = req;
        return {
          req: req.request,
          pubSub: this.pubSub,
          ...context
          // onConnect 에서 리턴한 객체는 req.connection.context에 들어간다.
          // 이 값을 context 객체에 포함 시키면 우리는 subscription에서도 사용자의 정보를 가져올 수 있다.
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
  private jwt = async (
    req,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
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
