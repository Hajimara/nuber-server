import { Resolvers } from "src/types/resolvers";
import { Between, getRepository } from "typeorm";
import User from "../../../entities/User";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetNearbyDrivers: privateResolver(async (_, __, { req }) => {
      const user: User = req.user;
      const { lastLat, lastLng } = user;
      try {
        const drivers: User[] = await getRepository(User).find({
          isDriving: true,
          lastLat: Between(lastLat - 0.05, lastLat + 0.05),
          lastLng: Between(lastLng - 0.05, lastLng + 0.05)
        });
        global.console.log(`drivers: ${drivers}`);
        return {
          ok: true,
          error: null,
          drivers
        }
      } catch(error) {
        return {
          ok: false,
          error: error.message,
          drivers: null
        }
      }
    })
  }
}

export default resolvers;

// typeorm에서는 두 가지 데이터 매핑 패턴을 제공한다고 한다.
//  하나가 Data Mapping이고 또 다른게 우리가 쓰는 Active Record 방식이다.
//  Data Mapping는 코드가 길어지지만, 좀 더 복잡한 관계의 데이터를 가져오는데 사용한다고 한다.