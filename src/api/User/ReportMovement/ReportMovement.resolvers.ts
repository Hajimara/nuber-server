import {
  ReportMovementMutationArgs,
  ReportMovementResponse
} from "src/types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: privateResolver(
      async (
        _,
        args: ReportMovementMutationArgs,
        { req, pubSub }
      ): Promise<ReportMovementResponse> => {
        const user: User = req.user;
        const notNull = cleanNullArgs(args);
        try {
          await User.update({ id: user.id }, { ...notNull });
          global.console.log(`${user}`);
          global.console.log(`${notNull}`);
          const updateUser = {...user, ...notNull };
          global.console.log(`${pubSub}`);
          pubSub.publish('driverUpdate', { DriversSubscription: updateUser});
          global.console.log(`${pubSub}`);
          //새로운 유저의 위치정보를 db에 저장하고, 이 정보를 pubSub.publish() 로 driverUpdate 채널명으로 보낸다.
          // 그러면 위에서 driverUpdate 채널명을 구독한 모든 유저에서는 갱신된 정보를 받아 올 수 있다.
          return {
            ok: true,
            error: null
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message
          };
        }
      }
    )
  }
};

export default resolvers;
