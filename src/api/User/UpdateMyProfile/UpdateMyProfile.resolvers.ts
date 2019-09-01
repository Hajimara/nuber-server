import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(async (_, args, { req }) => {
      const user: User = req.user;
      const notNull = cleanNullArgs(args);

      if (notNull.hasOwnProperty("password")) {
        user.password = notNull["password"];
        user.save();
        delete notNull["password"];
      }
      try {
        await User.update({ id: user.id }, { ...notNull });
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
    })
  }
};

export default resolvers;

// 아래 코드는 @BeforeInsert, @BeforeUpdate 트리거를 타지 않는다.
// await User.update({ id: user.id }, { ...notNull });
// 업데이트 할 때 트리거를 타는 경우는 아래처럼 인스턴스로 업데이트 할 때다.
// user.save()
