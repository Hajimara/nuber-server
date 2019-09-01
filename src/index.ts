import { Options } from "graphql-yoga";
import { createConnection } from "typeorm";
import app from "./app";
import ConnetionOptions from "./ormConfig";
import decodeJWT from "./utils/decodeJWT";

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";
const SUBSCRIPTION_ENDPOINT: string = "/subscription";

// 우리가 token을 통해 인증하는 방식은 http통신에 헤더를 통해서 이뤄졌다.
// subscription은 http통신 방식이 아닌 websocket이기 때문에 헤더가 없기 때문에 현재 인증이 되지 않는데
// graphql-yoga를 실행할 때, subscription에 대한 옵션을 넣어줄 수 있다.
// /subscription 을 엔드포인트로 하는 요청에 대해서 아래처럼 별도의 처리를 할 수 있다.
const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
  subscriptions: {
    path: SUBSCRIPTION_ENDPOINT,
    onConnect: async connectionParams => {
      const token = connectionParams["X-JWT"];
      if (token) {
        const user = await decodeJWT(token);
        if (user) {
          return {
            currentUser: user
          };
        }
        throw new Error("User not found");
      }
      throw new Error("Token not found");
    }
  }
};

const handleAppStat = () => console.log(`Listening on port ${PORT}`);

createConnection(ConnetionOptions)
  .then(_ => {
    app.start(appOptions, handleAppStat);
  })
  .catch(error => console.log(error));
