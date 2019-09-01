import { Resolvers } from "src/types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";

const resolvers: Resolvers = {
  Mutation: {
    ToggleDrivingMode: privateResolver(async (_, __, { req }) => {
      const user: User = req.user;
      // on off 전환 
      user.isDriving = !user.isDriving;
      user.save();
      return {
        ok: true,
        error: null
      };
    })
  }
};

export default resolvers;
// 사용자는 우버 앱을 켜서 근처에서 운행하는 차를 확인할 수 있다.
//  사용자는 드라이빙 모드로 전환해서 운행 정보를 주변에 알린다.
//  또 드라이빙 모드를 중단하면 이런 정보도 주변에 알려야 한다.
//  운전자 모드전환