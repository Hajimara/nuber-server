import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
    Subscription: {
      DriversSubscription: {
        subscribe: withFilter(
          (_, __, { pubSub, currentUser }) => pubSub.asyncIterator('driverUpdate'), 
          (payload, _, { currentUser }) => {
            const user: User = currentUser;
            const {
              DriversSubscription: {
                lastLat: driverLastLat,
                lastLng: driverLastLng
              }
            } = payload;
            const { lastLat: userLastLat, lastLng: userLastLng } = user;
            return (
              driverLastLat >= userLastLat - 0.05 &&
              driverLastLat <= userLastLat + 0.05 &&
              driverLastLng >= userLastLng - 0.05 &&
              driverLastLng <= userLastLng + 0.05
            );
          }
        )
      }
    }
  };

export default resolvers;
// 근처에 있는 운전자들을 유저에게 보내주는 기능
// driverUpdate 라는 이름으로 데이터가 오면
// DriversSubscription 라는 타입 타입으로 데이터를 받게 된다

// 모든 드라이버에 대한 정보를 받으면 문제가 생긴다.
// 나는 서울에 사는데 부산의 정보가 전혀 필요가 없기 때문이다.
//  우리는 근처에서 운행중인 정보만 가져오길 원한다. graohql-yoga 에는 withFilter 라는 함수가 있는데 
// 이 함수를 통해 채널로 들어온 데이터를 사용할지 말지에 대한 필터링을 할 수 있다.

// withFilter 함수는 첫 번째 인자로 기존의 구독함수를 받고, 두 번째 인자로 필터 함수를 받는다. 
// 필터 함수는 필수적으로 boolean 을 리턴해야 하는데, true가 값을 받고 false가 값을 무시한다.

// 구독 시작 후 reportMovement를 하면 payload는 운전자가 갱신한 자신의 정보가, 
// currentUser에는 구독한 유저에 대한 정보가 들어 있다.