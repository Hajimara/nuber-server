import Place from "../../../entities/Place";
import User from "../../../entities/User";
import { EditPlaceMutationArgs, EditPlaceResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArgs from "../../../utils/cleanNullArgs";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    EditPlace: privateResolver(
      async (
        _,
        args: EditPlaceMutationArgs,
        { req }
      ): Promise<EditPlaceResponse> => {
        const user: User = req.user;
        try {
          const place = await Place.findOne({ id: args.placeId });
          if (place) {
            if (place.userId === user.id) {
              const notNull: any = cleanNullArgs(args);
              delete notNull.placeId;
              await Place.update({ id: args.placeId }, { ...notNull });
              return {
                ok: true,
                error: null
              };
            } else {
              return {
                ok: false,
                error: "Not Authorized"
              };
            }
          } else {
            return {
              ok: false,
              error: "Place not found"
            };
          }
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
// place entity는 user에 관계되어 있다. place 를가져올 때,
// 관계가 있는 user 를 같이 가져오기 위해 아래처럼 relations 옵션을 줘야지 가져올 수 있다.
// 이런 방식은 일반적인 관계형 DB의 방식이지만 내가 필요한 데이터는
//  [user.id](http://user.id) 하나 뿐인데 너무 큰 비용이 발생한다고 생각할 수 있다.
//  근데 조회할 때 필요하지 않은데 모두 가져와 버리면 DB의 성능 문제가 발생할 것이다.
// 그래서 우리는 place entity에 userId 필드를 추가해서 손쉽게 가져올 것이다
//   const place = await Place.findOne({ id: args.placeId }, { relations: ["user"] });

//               const notNull: any = cleanNullArgs(args);
//               delete notNull.placeId;
//               await Place.update({ id: args.placeId }, { ...notNull });
// args에는 placeId라는 프로퍼티가 있다. 이 값에 일치하는 id를 가진 Place를 찾는데, 이때
// notNull 객체가 placeId를 프로퍼티로 갖는게 문제다.
// id 를 업데이트 하는 것 자체도 논리적으로 문제지만, Place entity에는 id는 정의되어 있지만 placeId가 정의되어 있지 않다.
// 그렇기 때문에 오류가 발생해서 placeId는 일치하는 값을 찾는데에만 쓰기 때문에 제거하는 로직을 추가 하였다.
