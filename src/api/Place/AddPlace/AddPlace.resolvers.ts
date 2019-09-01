import { Resolvers } from "src/types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { AddPlaceMutationArgs, AddPlaceResponse } from "src/types/graph";
import User from "src/entities/User";
import Place from "../../../entities/Place";

const resolvers: Resolvers = {
    Mutation: {
        AddPlace: privateResolver(async(_,args: AddPlaceMutationArgs,{req}):Promise<AddPlaceResponse>=>{
            const user: User = req.user;
            try {
                await Place.create({ ...args,user}).save();
                return {
                    ok: true,
                    error: null
                }
            } catch (error) {
                return {
                    ok:false,
                    error: error.message
                }
            }
        })
    }
}

export default resolvers;

// 장소에 대한 정보 추가