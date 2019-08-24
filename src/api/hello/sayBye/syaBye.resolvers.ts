const resolvers = {
    Query : {
        sayBye: () => "Hey Bye see ya!"
    }
}

export default resolvers;

//.graphql은 router의 endpoint, 
//.resolvers는 실제 요청을 수행하는 
//컨트롤러 또는 서비스라고 생각하면 될 것 같다.